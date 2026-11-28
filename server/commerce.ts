import type { Express, Request, Response } from "express";
import Stripe from "stripe";
import { z } from "zod";
import { storage } from "./storage";
import { isDatabaseConfigured } from "./db";
import { isEmailConfigured, sendOrderConfirmation } from "./mail";
import { generateUnsubscribeToken } from "./newsletter-service";
import { commerceCheckoutSchema, surveySchema } from "@shared/checkout";
import {
  ALLERGEN_STATEMENT,
  COTTAGE_FOOD_DISCLOSURE,
  DEFAULT_BATCH_CAPACITY_DOZENS,
  DEFAULT_BATCH_LABEL,
  DEFAULT_EARLY_BIRD_PERCENT,
  DEFAULT_LOCAL_DELIVERY_ZIPS,
  FLAVORS,
  LOCAL_DELIVERY_CENTS,
  PACKS,
  PICKUP_NOTE,
  SHIPPING_CENTS,
  earlyBirdPriceCents,
  flavorById,
  formatCents,
  isFloridaZip,
  packById,
  type Flavor,
  type Pack,
} from "@shared/catalog";

const PAYMENTS_NOT_CONFIGURED =
  "Payments are not configured. Set STRIPE_SECRET_KEY to a Stripe test key (sk_test_...) to take payment. You can still record a reservation; the customer is not charged.";

function earlyBirdPercent(): number {
  const raw = Number(process.env.EARLY_BIRD_PERCENT ?? DEFAULT_EARLY_BIRD_PERCENT);
  if (!Number.isFinite(raw) || raw < 0 || raw > 40) return DEFAULT_EARLY_BIRD_PERCENT;
  return raw;
}

function batchCapacity(): number {
  const raw = Number(process.env.BATCH_CAPACITY_DOZENS ?? DEFAULT_BATCH_CAPACITY_DOZENS);
  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_BATCH_CAPACITY_DOZENS;
  return raw;
}

function batchLabel(): string {
  return process.env.BATCH_LABEL?.trim() || DEFAULT_BATCH_LABEL;
}

function preorderWindow(): { open: boolean; cutoff: string | null } {
  const raw = process.env.PREORDER_CUTOFF?.trim();
  if (!raw) return { open: true, cutoff: null };
  const cutoff = new Date(raw);
  if (Number.isNaN(cutoff.getTime())) return { open: true, cutoff: null };
  return { open: Date.now() <= cutoff.getTime(), cutoff: cutoff.toISOString() };
}

function deliveryPrefixes(): string[] {
  const raw = process.env.LOCAL_DELIVERY_ZIPS?.trim();
  if (!raw) return DEFAULT_LOCAL_DELIVERY_ZIPS;
  const prefixes = raw.split(",").map((part) => part.trim()).filter(Boolean);
  return prefixes.length > 0 ? prefixes : DEFAULT_LOCAL_DELIVERY_ZIPS;
}

export function stripeReadiness(): { configured: boolean; message: string } {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    return { configured: false, message: PAYMENTS_NOT_CONFIGURED };
  }
  if (!key.startsWith("sk_test_")) {
    return {
      configured: false,
      message:
        "Payments are not configured for this server. Only Stripe test keys (sk_test_...) are accepted. A live secret key was refused.",
    };
  }
  return { configured: true, message: "Stripe test mode is configured." };
}

function getStripe(): Stripe | null {
  if (!stripeReadiness().configured) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY as string);
}

function isAdmin(req: Request): boolean {
  const sessionUser = (req as Request & { session?: { userId?: string } }).session?.userId;
  if (sessionUser) return true;
  const token = process.env.ADMIN_TOKEN?.trim();
  if (!token) return false;
  const header = req.get("x-admin-token") || "";
  const bearer = (req.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return header === token || bearer === token;
}

async function dozenUnitsReserved(): Promise<number> {
  const orders = await storage.getOrders();
  let units = 0;
  for (const order of orders) {
    if (order.status === "cancelled" || order.status === "refunded") continue;
    if (!order.isPreorder) continue;
    const items = await storage.getOrderItems(order.id);
    for (const item of items) {
      const pack = packById(item.packSize || "");
      if (!pack) continue;
      units += pack.dozenUnits * item.quantity;
    }
  }
  return units;
}

function catalogPayload() {
  const percent = earlyBirdPercent();
  return {
    flavors: FLAVORS.map((flavor) => ({
      id: flavor.id,
      name: flavor.name,
      epithet: flavor.epithet,
      description: flavor.description,
      tasting: flavor.tasting,
      ingredients: flavor.ingredients,
    })),
    packs: PACKS.map((pack) => ({
      id: pack.id,
      cookies: pack.cookies,
      name: pack.name,
      netWeight: pack.netWeight,
      listPriceCents: pack.listPriceCents,
      earlyBirdPriceCents: earlyBirdPriceCents(pack.listPriceCents, percent),
    })),
    earlyBirdPercent: percent,
    thirdFlavor: {
      id: "undecided",
      name: "Third flavor",
      status: "Not in this batch. Tell us what you want pressed next.",
    },
  };
}

async function ensureSku(flavor: Flavor, pack: Pack, unitCents: number): Promise<string> {
  const slug = `preorder-${flavor.id}-${pack.id}`;
  const existing = await storage.getProductBySlug(slug);
  if (existing) return existing.id;
  const created = await storage.createProduct({
    name: `Irma's ${flavor.name} Pizzelle — ${pack.name}`,
    slug,
    description: flavor.description,
    shortDescription: flavor.tasting,
    price: (unitCents / 100).toFixed(2),
    compareAtPrice: (pack.listPriceCents / 100).toFixed(2),
    category: "preorder",
    flavor: flavor.id,
    size: `${pack.cookies} cookies`,
    weight: pack.netWeight,
    inventory: 999,
    isActive: false,
    isFeatured: false,
  });
  return created.id;
}

function requestOrigin(req: Request): string {
  const proto = req.get("x-forwarded-proto") || req.protocol;
  const host = req.get("x-forwarded-host") || req.get("host");
  return `${proto}://${host}`;
}

export function registerCommerceRoutes(app: Express) {
  app.get("/api/commerce/config", async (_req, res) => {
    const stripe = stripeReadiness();
    const window = preorderWindow();
    const reserved = await dozenUnitsReserved();
    const capacity = batchCapacity();
    res.json({
      ...catalogPayload(),
      stripeConfigured: stripe.configured,
      paymentsMessage: stripe.message,
      emailConfigured: isEmailConfigured(),
      databaseConfigured: isDatabaseConfigured,
      batchLabel: batchLabel(),
      batchCapacityDozens: capacity,
      dozenUnitsReserved: reserved,
      dozenUnitsRemaining: Math.max(0, capacity - reserved),
      preorderOpen: window.open,
      preorderCutoff: window.cutoff,
      cottageDisclosure: COTTAGE_FOOD_DISCLOSURE,
      allergenStatement: ALLERGEN_STATEMENT,
      fulfillment: {
        pickup: { cents: 0, note: PICKUP_NOTE },
        local_delivery: {
          cents: LOCAL_DELIVERY_CENTS,
          zipPrefixes: deliveryPrefixes(),
          note: "Local delivery inside the Tampa Bay ZIP prefixes below. Florida only.",
        },
        in_state_shipping: {
          cents: SHIPPING_CENTS,
          note: "USPS or commercial carrier, Florida addresses only. Thin wafers — we pack them to travel, and shelf life in transit is still being tested.",
        },
      },
      tax: {
        collectedCents: 0,
        note: "This pre-order flow does not collect sales tax. Packaged bakery goods sold for consumption off the premises are generally exempt under Florida Statute 212.08(1). Confirm with the Department of Revenue or a tax advisor before going live. See docs/COMMERCE_READINESS.md.",
      },
    });
  });

  app.post("/api/commerce/survey", async (req, res) => {
    const parsed = surveySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message || "Check the form and try again." });
    }
    const data = parsed.data;
    try {
      const customer = await storage.upsertCustomer({
        email: data.email,
        firstName: data.firstName,
        preferredFlavor: data.preferredFlavor,
        preferredPackSize: data.preferredPackSize,
        wouldReorderMonthly: data.wouldReorderMonthly,
        thirdFlavorIdea: data.thirdFlavorIdea,
        marketingOptIn: data.marketingOptIn ?? false,
      });

      if (data.marketingOptIn) {
        const existing = await storage.getNewsletterSubscriber(data.email);
        if (!existing) {
          await storage.addNewsletterSubscriber({
            email: data.email.toLowerCase(),
            firstName: data.firstName || null,
            status: "active",
            unsubscribeToken: generateUnsubscribeToken(),
          });
        } else if (existing.status !== "active") {
          await storage.updateNewsletterSubscriber(existing.id, { status: "active" });
        }
      }

      res.status(201).json({ ok: true, customerId: customer.id });
    } catch (error) {
      console.error("Survey failed", error);
      res.status(500).json({ error: "Could not save that. Try again in a moment." });
    }
  });

  app.post("/api/commerce/checkout", async (req, res) => {
    const parsed = commerceCheckoutSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message || "Check the form and try again." });
    }
    const body = parsed.data;
    const window = preorderWindow();
    if (!window.open) {
      return res.status(400).json({
        error: `This batch is closed${window.cutoff ? ` (cutoff ${window.cutoff})` : ""}. Join the list and we'll write when the next iron heats up.`,
      });
    }

    if (body.fulfillment === "local_delivery") {
      const zip = body.address?.zipCode || "";
      const prefix = zip.replace(/\D/g, "").slice(0, 3);
      if (!deliveryPrefixes().some((allowed) => prefix.startsWith(allowed) || allowed.startsWith(prefix))) {
        return res.status(400).json({
          error: `Local delivery currently covers ZIP prefixes ${deliveryPrefixes().join(", ")}. Choose in-state shipping or pickup, or write to us if you're nearby.`,
        });
      }
    }

    if (body.fulfillment === "in_state_shipping" && body.address?.zipCode && !isFloridaZip(body.address.zipCode)) {
      return res.status(400).json({
        error: "Shipping is limited to Florida ZIP codes (32000–34999) while Irma's operates under the cottage food law.",
      });
    }

    const percent = earlyBirdPercent();
    const priced: Array<{
      flavor: Flavor;
      pack: Pack;
      quantity: number;
      unitCents: number;
      lineCents: number;
    }> = [];

    for (const item of body.items) {
      const flavor = flavorById(item.flavor);
      const pack = packById(item.packSize);
      if (!flavor || !pack) {
        return res.status(400).json({ error: "Unknown flavor or pack size." });
      }
      const unitCents = earlyBirdPriceCents(pack.listPriceCents, percent);
      priced.push({
        flavor,
        pack,
        quantity: item.quantity,
        unitCents,
        lineCents: unitCents * item.quantity,
      });
    }

    const addedUnits = priced.reduce((sum, line) => sum + line.pack.dozenUnits * line.quantity, 0);
    const reserved = await dozenUnitsReserved();
    const capacity = batchCapacity();
    if (reserved + addedUnits > capacity + 1e-9) {
      return res.status(409).json({
        error: `This batch has ${Math.max(0, capacity - reserved).toFixed(1)} dozen left, and this order needs ${addedUnits.toFixed(1)}. Reduce the quantity or wait for the next batch.`,
      });
    }

    const subtotalCents = priced.reduce((sum, line) => sum + line.pack.listPriceCents * line.quantity, 0);
    const discountedCents = priced.reduce((sum, line) => sum + line.lineCents, 0);
    const discountCents = subtotalCents - discountedCents;
    const shippingCents =
      body.fulfillment === "local_delivery"
        ? LOCAL_DELIVERY_CENTS
        : body.fulfillment === "in_state_shipping"
          ? SHIPPING_CENTS
          : 0;
    const taxCents = 0;
    const totalCents = discountedCents + shippingCents + taxCents;

    try {
      const customer = await storage.upsertCustomer({
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        preferredFlavor: priced[0]?.flavor.id,
        preferredPackSize: priced[0]?.pack.id,
        wouldReorderMonthly: body.wouldReorderMonthly,
        thirdFlavorIdea: body.thirdFlavorIdea,
        marketingOptIn: body.marketingOptIn ?? false,
      });

      if (body.marketingOptIn) {
        const existing = await storage.getNewsletterSubscriber(body.email);
        if (!existing) {
          await storage.addNewsletterSubscriber({
            email: body.email.toLowerCase(),
            firstName: body.firstName,
            status: "active",
            unsubscribeToken: generateUnsubscribeToken(),
          });
        }
      }

      const stripe = stripeReadiness();
      const shippingName = `${body.firstName} ${body.lastName}`.trim();
      const order = await storage.createOrder({
        email: body.email.toLowerCase(),
        status: "pending",
        subtotal: (subtotalCents / 100).toFixed(2),
        discountAmount: (discountCents / 100).toFixed(2),
        shippingAmount: (shippingCents / 100).toFixed(2),
        taxAmount: (taxCents / 100).toFixed(2),
        total: (totalCents / 100).toFixed(2),
        promoCode: "EARLYBIRD",
        promoDiscount: (discountCents / 100).toFixed(2),
        paymentState: stripe.configured ? "awaiting_stripe" : "not_configured",
        customerId: customer.id,
        fulfillmentMethod: body.fulfillment,
        isPreorder: true,
        earlyBirdPercent: percent.toFixed(2),
        batchLabel: batchLabel(),
        variant: body.variant,
        shippingName,
        shippingStreet: body.address?.street,
        shippingCity: body.address?.city,
        shippingState: body.fulfillment === "pickup" ? "FL" : body.address?.state,
        shippingZipCode: body.address?.zipCode,
        shippingCountry: "USA",
        shippingPhone: body.phone,
        customerNotes: body.customerNotes,
      });

      for (const line of priced) {
        const productId = await ensureSku(line.flavor, line.pack, line.unitCents);
        await storage.createOrderItem({
          orderId: order.id,
          productId,
          productName: `Irma's ${line.flavor.name} Pizzelle — ${line.pack.name} (${line.pack.cookies})`,
          productPrice: (line.unitCents / 100).toFixed(2),
          quantity: line.quantity,
          total: (line.lineCents / 100).toFixed(2),
          flavor: line.flavor.id,
          packSize: line.pack.id,
        });
      }

      if (!stripe.configured) {
        const items = await storage.getOrderItems(order.id);
        const email = await sendOrderConfirmation(order, items, "reserved");
        return res.status(201).json({
          orderNumber: order.orderNumber,
          orderId: order.id,
          total: order.total,
          paymentsConfigured: false,
          message: stripe.message,
          checkoutUrl: null,
          email,
        });
      }

      const client = getStripe();
      if (!client) {
        return res.status(201).json({
          orderNumber: order.orderNumber,
          orderId: order.id,
          total: order.total,
          paymentsConfigured: false,
          message: stripe.message,
          checkoutUrl: null,
          email: { sent: false, reason: "email skipped" },
        });
      }

      const origin = requestOrigin(req);
      const variant = body.variant || "atelier";
      const session = await client.checkout.sessions.create({
        mode: "payment",
        customer_email: body.email,
        client_reference_id: order.id,
        success_url: `${origin}/v/order/${order.orderNumber}?v=${variant}&paid=1`,
        cancel_url: `${origin}/v/${variant}/checkout?canceled=1`,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
        line_items: [
          ...priced.map((line) => ({
            quantity: line.quantity,
            price_data: {
              currency: "usd",
              unit_amount: line.unitCents,
              product_data: {
                name: `Irma's ${line.flavor.name} Pizzelle — ${line.pack.name}`,
                description: `${line.pack.cookies} five-inch wafers. ${line.pack.netWeight}. Early-bird pre-order.`,
              },
            },
          })),
          ...(shippingCents > 0
            ? [{
                quantity: 1,
                price_data: {
                  currency: "usd",
                  unit_amount: shippingCents,
                  product_data: {
                    name: body.fulfillment === "local_delivery" ? "Tampa Bay local delivery" : "Florida shipping",
                    description: "Cottage-food fulfillment inside Florida.",
                  },
                },
              }]
            : []),
        ],
      });

      await storage.updateOrder(order.id, { stripeCheckoutSessionId: session.id });

      return res.status(201).json({
        orderNumber: order.orderNumber,
        orderId: order.id,
        total: order.total,
        paymentsConfigured: true,
        message: "Redirecting to Stripe Checkout in test mode.",
        checkoutUrl: session.url,
        email: { sent: false, reason: "sent after payment" },
      });
    } catch (error) {
      console.error("Checkout failed", error);
      const message = error instanceof Error ? error.message : "Checkout failed";
      return res.status(500).json({ error: message });
    }
  });

  app.post("/api/stripe/webhook", async (req, res) => {
    const stripe = getStripe();
    const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
    if (!stripe || !secret) {
      return res.status(501).json({
        error: "Payments not configured",
        message: "Stripe webhook is not configured. Set STRIPE_SECRET_KEY (sk_test_...) and STRIPE_WEBHOOK_SECRET.",
      });
    }

    const signature = req.get("stripe-signature");
    const raw = (req as Request & { rawBody?: unknown }).rawBody;
    if (!signature || !raw) {
      return res.status(400).json({ error: "Missing Stripe signature or raw body." });
    }

    let event: Stripe.Event;
    try {
      const payload = Buffer.isBuffer(raw) ? raw : Buffer.from(typeof raw === "string" ? raw : JSON.stringify(raw));
      event = stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
      console.error("Stripe webhook signature failed", error);
      return res.status(400).json({ error: "Invalid Stripe signature." });
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId || session.client_reference_id || undefined;
        if (orderId && session.payment_status === "paid") {
          const paymentIntent = typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;
          const updated = await storage.updateOrder(orderId, {
            status: "paid",
            paymentState: "paid",
            paidAt: new Date(),
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: paymentIntent,
          });
          if (updated) {
            const items = await storage.getOrderItems(updated.id);
            await sendOrderConfirmation(updated, items, "paid");
          }
        }
      }

      if (event.type === "checkout.session.expired") {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId || session.client_reference_id || undefined;
        if (orderId) {
          const existing = await storage.getOrderById(orderId);
          if (existing && existing.status === "pending") {
            await storage.updateOrder(orderId, {
              status: "cancelled",
              paymentState: "expired",
            });
          }
        }
      }
    } catch (error) {
      console.error("Stripe webhook handler failed", error);
      return res.status(500).json({ error: "Webhook handler failed." });
    }

    res.json({ received: true });
  });

  app.get("/api/admin/orders", async (req, res) => {
    if (!isAdmin(req)) {
      return res.status(401).json({
        error: "Authentication required",
        message: process.env.ADMIN_TOKEN
          ? "Send the admin token in the x-admin-token header."
          : "Set ADMIN_TOKEN, or sign in so the session has a userId. The order desk is closed until then.",
      });
    }
    const orders = await storage.getOrders();
    const withItems = await Promise.all(orders.map(async (order) => ({
      ...order,
      items: await storage.getOrderItems(order.id),
    })));
    res.json({ orders: withItems, databaseConfigured: isDatabaseConfigured });
  });

  app.patch("/api/admin/orders/:id", async (req, res) => {
    if (!isAdmin(req)) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const parsed = z.object({
      status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]).optional(),
      adminNotes: z.string().max(2000).optional(),
      trackingNumber: z.string().max(120).optional(),
    }).safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid update." });
    }
    const updated = await storage.updateOrder(req.params.id, parsed.data);
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json(updated);
  });
}
