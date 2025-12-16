import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertAddressSchema, insertWaitlistEntrySchema } from "@shared/schema";
import { z } from "zod";
import { generateUnsubscribeToken, sendWeeklyNewsletter } from "./newsletter-service";

// Middleware to get user from session (if authenticated)
async function getUser(req: Request) {
  const session = (req as any).session;
  const userId = session?.userId;
  if (!userId) return null;
  return storage.getUser(userId);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============ PRODUCTS API ============
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts(true);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get featured products
  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });

  // Get single product
  app.get("/api/products/:idOrSlug", async (req, res) => {
    try {
      const { idOrSlug } = req.params;
      let product = await storage.getProductById(idOrSlug);
      if (!product) {
        product = await storage.getProductBySlug(idOrSlug);
      }
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // ============ PROMOTIONS API ============
  
  // Validate promo code
  app.post("/api/promotions/validate", async (req, res) => {
    try {
      const { code, subtotal } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Promo code is required" });
      }

      const promo = await storage.getPromotionByCode(code);
      
      if (!promo) {
        return res.status(404).json({ error: "Invalid promo code" });
      }

      // Check if expired
      if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
        return res.status(400).json({ error: "Promo code has expired" });
      }

      // Check if not yet active
      if (promo.startsAt && new Date(promo.startsAt) > new Date()) {
        return res.status(400).json({ error: "Promo code is not yet active" });
      }

      // Check max redemptions
      if (promo.maxRedemptions && (promo.currentRedemptions || 0) >= promo.maxRedemptions) {
        return res.status(400).json({ error: "Promo code has reached maximum redemptions" });
      }

      // Check minimum order amount
      if (promo.minOrderAmount && subtotal < parseFloat(promo.minOrderAmount)) {
        return res.status(400).json({ 
          error: `Minimum order amount of $${promo.minOrderAmount} required` 
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (promo.discountType === "percentage") {
        discountAmount = (subtotal * parseFloat(promo.discountValue)) / 100;
      } else {
        discountAmount = parseFloat(promo.discountValue);
      }

      res.json({
        valid: true,
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        discountAmount: discountAmount.toFixed(2),
        description: promo.description,
      });
    } catch (error) {
      console.error("Error validating promo:", error);
      res.status(500).json({ error: "Failed to validate promo code" });
    }
  });

  // ============ ORDERS API ============
  
  // Create order (checkout)
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, email, shippingAddress, promoCode, customerNotes } = req.body;
      
      if (!items || items.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Calculate totals
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await storage.getProductById(item.productId);
        if (!product) {
          return res.status(400).json({ error: `Product ${item.productId} not found` });
        }
        
        const itemTotal = parseFloat(product.price) * item.quantity;
        subtotal += itemTotal;
        
        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          quantity: item.quantity,
          total: itemTotal.toFixed(2),
        });
      }

      // Apply promo if provided
      let discountAmount = 0;
      if (promoCode) {
        const promo = await storage.getPromotionByCode(promoCode);
        if (promo) {
          if (promo.discountType === "percentage") {
            discountAmount = (subtotal * parseFloat(promo.discountValue)) / 100;
          } else {
            discountAmount = parseFloat(promo.discountValue);
          }
          // Increment redemptions
          await storage.incrementPromotionRedemptions(promo.id);
        }
      }

      const shippingAmount = subtotal >= 50 ? 0 : 7.99; // Free shipping over $50
      const taxAmount = (subtotal - discountAmount) * 0.08; // 8% tax
      const total = subtotal - discountAmount + shippingAmount + taxAmount;

      // Get user if authenticated
      const user = await getUser(req);

      // Create order
      const order = await storage.createOrder({
        userId: user?.id,
        email,
        status: "pending",
        subtotal: subtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        shippingAmount: shippingAmount.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        total: total.toFixed(2),
        promoCode,
        promoDiscount: discountAmount.toFixed(2),
        shippingName: shippingAddress?.name,
        shippingStreet: shippingAddress?.street,
        shippingCity: shippingAddress?.city,
        shippingState: shippingAddress?.state,
        shippingZipCode: shippingAddress?.zipCode,
        shippingCountry: shippingAddress?.country || "USA",
        shippingPhone: shippingAddress?.phone,
        customerNotes,
      });

      // Create order items
      for (const item of orderItemsData) {
        await storage.createOrderItem({
          orderId: order.id,
          ...item,
        });
      }

      res.status(201).json({
        order,
        message: "Order created successfully",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Get user orders
  app.get("/api/orders", async (req, res) => {
    try {
      const user = await getUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const orders = await storage.getOrdersByUserId(user.id);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get single order
  app.get("/api/orders/:orderNumber", async (req, res) => {
    try {
      const order = await storage.getOrderByOrderNumber(req.params.orderNumber);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const items = await storage.getOrderItems(order.id);
      res.json({ ...order, items });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // ============ CUSTOMER API ============
  
  // Get customer profile
  app.get("/api/customer/profile", async (req, res) => {
    try {
      const user = await getUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Update customer profile
  app.patch("/api/customer/profile", async (req, res) => {
    try {
      const user = await getUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { firstName, lastName } = req.body;
      const updated = await storage.updateUser(user.id, { firstName, lastName });
      res.json(updated);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Get customer addresses
  app.get("/api/customer/addresses", async (req, res) => {
    try {
      const user = await getUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const addresses = await storage.getAddressesByUserId(user.id);
      res.json(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      res.status(500).json({ error: "Failed to fetch addresses" });
    }
  });

  // Add address
  app.post("/api/customer/addresses", async (req, res) => {
    try {
      const user = await getUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const validatedData = insertAddressSchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const address = await storage.createAddress(validatedData);
      res.status(201).json(address);
    } catch (error) {
      console.error("Error creating address:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create address" });
    }
  });

  // Delete address
  app.delete("/api/customer/addresses/:id", async (req, res) => {
    try {
      const user = await getUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      await storage.deleteAddress(req.params.id);
      res.json({ message: "Address deleted" });
    } catch (error) {
      console.error("Error deleting address:", error);
      res.status(500).json({ error: "Failed to delete address" });
    }
  });

  // ============ WAITLIST API ============
  
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistEntrySchema.parse(req.body);
      
      // Check if already on waitlist
      const existing = await storage.getWaitlistEntry(validatedData.email);
      if (existing) {
        return res.status(400).json({ error: "Email already on waitlist" });
      }
      
      const entry = await storage.addToWaitlist(validatedData);
      res.status(201).json({ message: "Successfully joined the waitlist!", entry });
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to join waitlist" });
    }
  });

  // ============ NEWSLETTER API ============
  
  // Subscribe to newsletter
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email, firstName } = req.body;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: "Valid email is required" });
      }

      // Check if already subscribed
      const existing = await storage.getNewsletterSubscriber(email);
      if (existing) {
        if (existing.status === 'active') {
          return res.status(400).json({ error: "Email already subscribed" });
        }
        // Reactivate if previously unsubscribed
        await storage.updateNewsletterSubscriber(existing.id, { status: 'active' });
        return res.json({ message: "Welcome back! You've been resubscribed." });
      }

      const subscriber = await storage.addNewsletterSubscriber({
        email,
        firstName: firstName || null,
        status: 'active',
        unsubscribeToken: generateUnsubscribeToken(),
      });

      res.status(201).json({ 
        message: "Successfully subscribed to our newsletter!",
        subscriber: { email: subscriber.email }
      });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  // Unsubscribe from newsletter
  app.get("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: "Invalid unsubscribe token" });
      }

      const subscriber = await storage.getNewsletterSubscriberByToken(token);
      if (!subscriber) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      await storage.unsubscribeNewsletter(token);
      res.json({ message: "Successfully unsubscribed from newsletter" });
    } catch (error) {
      console.error("Error unsubscribing:", error);
      res.status(500).json({ error: "Failed to unsubscribe" });
    }
  });

  // Trigger newsletter send (admin endpoint - in production, protect with auth)
  app.post("/api/newsletter/send", async (req, res) => {
    try {
      const result = await sendWeeklyNewsletter();
      res.json({
        message: `Newsletter sent successfully to ${result.sentCount} subscribers`,
        issueId: result.issueId,
        sentCount: result.sentCount,
      });
    } catch (error) {
      console.error("Error sending newsletter:", error);
      res.status(500).json({ error: "Failed to send newsletter" });
    }
  });

  // Get newsletter issues (admin)
  app.get("/api/newsletter/issues", async (req, res) => {
    try {
      const issues = await storage.getNewsletterIssues();
      res.json(issues);
    } catch (error) {
      console.error("Error fetching newsletter issues:", error);
      res.status(500).json({ error: "Failed to fetch issues" });
    }
  });

  // ============ RECIPE ACCESS API ============
  
  // Check if user has recipe access (must be authenticated)
  app.get("/api/recipes/access", async (req, res) => {
    try {
      const user = await getUser(req);
      if (!user) {
        return res.status(401).json({ 
          hasAccess: false, 
          message: "Please sign in to access exclusive recipes" 
        });
      }
      res.json({ hasAccess: true, user: { firstName: user.firstName } });
    } catch (error) {
      console.error("Error checking recipe access:", error);
      res.status(500).json({ error: "Failed to check access" });
    }
  });

  return httpServer;
}
