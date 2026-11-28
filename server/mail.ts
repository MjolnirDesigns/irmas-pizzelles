import { Resend } from "resend";
import type { Order, OrderItem } from "@shared/schema";
import { ALLERGEN_STATEMENT, COTTAGE_FOOD_DISCLOSURE, formatCents } from "@shared/catalog";

export function isEmailConfigured(): boolean {
  if (process.env.RESEND_API_KEY) return true;
  return Boolean(process.env.REPLIT_CONNECTORS_HOSTNAME && (process.env.REPL_IDENTITY || process.env.WEB_REPL_RENEWAL));
}

async function resolveResend(): Promise<{ client: Resend; from: string } | null> {
  if (process.env.RESEND_API_KEY) {
    return {
      client: new Resend(process.env.RESEND_API_KEY),
      from: process.env.RESEND_FROM_EMAIL || "Irma's Pizzelles <orders@irmaspizzelles.com>",
    };
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const token = process.env.REPL_IDENTITY
    ? `repl ${process.env.REPL_IDENTITY}`
    : process.env.WEB_REPL_RENEWAL
      ? `depl ${process.env.WEB_REPL_RENEWAL}`
      : null;
  if (!hostname || !token) return null;

  try {
    const response = await fetch(
      `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=resend`,
      {
        headers: {
          Accept: "application/json",
          "X_REPLIT_TOKEN": token,
        },
      },
    );
    const data = await response.json();
    const settings = data.items?.[0]?.settings;
    if (!settings?.api_key) return null;
    return {
      client: new Resend(settings.api_key),
      from: settings.from_email || "Irma's Pizzelles <orders@irmaspizzelles.com>",
    };
  } catch (error) {
    console.error("[mail] Replit Resend connector lookup failed", error);
    return null;
  }
}

function money(value: string | null | undefined): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "$0.00";
  return formatCents(Math.round(n * 100));
}

export async function sendOrderConfirmation(
  order: Order,
  items: OrderItem[],
  kind: "paid" | "reserved",
): Promise<{ sent: boolean; reason?: string }> {
  const resolved = await resolveResend();
  if (!resolved) {
    console.log(`[mail] no-op ${kind} email for ${order.orderNumber} — email not configured`);
    return { sent: false, reason: "email not configured" };
  }

  const lines = items
    .map((item) => `${item.quantity} × ${item.productName} — ${money(item.total)}`)
    .join("\n");

  const charged =
    kind === "paid"
      ? "Payment received. This is your pre-order confirmation."
      : "Payments are not configured on this server, so you have not been charged. We saved your reservation and will be in touch before anything is billed.";

  const text = [
    "Irma's Pizzelles",
    charged,
    "",
    `Order ${order.orderNumber}`,
    `Batch: ${order.batchLabel || "Soft launch"}`,
    `Fulfillment: ${(order.fulfillmentMethod || "pickup").replaceAll("_", " ")}`,
    "",
    lines,
    "",
    `Subtotal ${money(order.subtotal)}`,
    `Early-bird savings ${money(order.discountAmount)}`,
    `Fulfillment ${money(order.shippingAmount)}`,
    `Total ${money(order.total)}`,
    "",
    ALLERGEN_STATEMENT,
    COTTAGE_FOOD_DISCLOSURE,
    "",
    "Store airtight in a cool, dry place. These are thin wafers — we'll pack them to travel, and we'll tell you if a batch needs to be picked up instead.",
  ].join("\n");

  try {
    await resolved.client.emails.send({
      from: resolved.from,
      to: order.email,
      subject:
        kind === "paid"
          ? `Reserved — Irma's Pizzelles ${order.orderNumber}`
          : `Reservation saved — Irma's Pizzelles ${order.orderNumber}`,
      text,
    });
    return { sent: true };
  } catch (error) {
    console.error("[mail] confirmation failed", error);
    return { sent: false, reason: "send failed" };
  }
}
