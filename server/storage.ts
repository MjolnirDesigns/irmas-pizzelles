import { db } from "./db";
import { eq, and, sql, desc } from "drizzle-orm";
import {
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  promotions, type Promotion, type InsertPromotion,
  addresses, type Address, type InsertAddress,
  waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  newsletterIssues, type NewsletterIssue, type InsertNewsletterIssue,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByReplitId(replitId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  
  // Products
  getProducts(activeOnly?: boolean): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, data: Partial<InsertOrder>): Promise<Order | undefined>;
  
  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Promotions
  getPromotionByCode(code: string): Promise<Promotion | undefined>;
  incrementPromotionRedemptions(id: string): Promise<void>;
  
  // Addresses
  getAddressesByUserId(userId: string): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: string, data: Partial<InsertAddress>): Promise<Address | undefined>;
  deleteAddress(id: string): Promise<void>;
  
  // Waitlist
  addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntry(email: string): Promise<WaitlistEntry | undefined>;
  
  // Newsletter
  addNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscriber(email: string): Promise<NewsletterSubscriber | undefined>;
  getNewsletterSubscriberByToken(token: string): Promise<NewsletterSubscriber | undefined>;
  getActiveNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  updateNewsletterSubscriber(id: string, data: Partial<InsertNewsletterSubscriber>): Promise<NewsletterSubscriber | undefined>;
  unsubscribeNewsletter(token: string): Promise<void>;
  
  // Newsletter Issues
  createNewsletterIssue(issue: InsertNewsletterIssue): Promise<NewsletterIssue>;
  getNewsletterIssues(): Promise<NewsletterIssue[]>;
  updateNewsletterIssue(id: string, data: Partial<InsertNewsletterIssue>): Promise<NewsletterIssue | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByReplitId(replitId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.replitId, replitId));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  // Products
  async getProducts(activeOnly = true): Promise<Product[]> {
    if (activeOnly) {
      return db.select().from(products).where(eq(products.isActive, true));
    }
    return db.select().from(products);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return db.select().from(products).where(
      and(eq(products.isActive, true), eq(products.isFeatured, true))
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(data).where(eq(products.id, id)).returning();
    return updated;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const orderNumber = `IP${Date.now().toString(36).toUpperCase()}`;
    const [created] = await db.insert(orders).values({
      ...order,
      orderNumber,
    }).returning();
    return created;
  }

  async updateOrder(id: string, data: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set({
      ...data,
      updatedAt: new Date(),
    }).where(eq(orders.id, id)).returning();
    return updated;
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [created] = await db.insert(orderItems).values(item).returning();
    return created;
  }

  // Promotions
  async getPromotionByCode(code: string): Promise<Promotion | undefined> {
    const [promo] = await db.select().from(promotions).where(
      and(
        eq(promotions.code, code.toUpperCase()),
        eq(promotions.isActive, true)
      )
    );
    return promo;
  }

  async incrementPromotionRedemptions(id: string): Promise<void> {
    await db.update(promotions).set({
      currentRedemptions: sql`${promotions.currentRedemptions} + 1`,
    }).where(eq(promotions.id, id));
  }

  // Addresses
  async getAddressesByUserId(userId: string): Promise<Address[]> {
    return db.select().from(addresses).where(eq(addresses.userId, userId));
  }

  async createAddress(address: InsertAddress): Promise<Address> {
    const [created] = await db.insert(addresses).values(address).returning();
    return created;
  }

  async updateAddress(id: string, data: Partial<InsertAddress>): Promise<Address | undefined> {
    const [updated] = await db.update(addresses).set(data).where(eq(addresses.id, id)).returning();
    return updated;
  }

  async deleteAddress(id: string): Promise<void> {
    await db.delete(addresses).where(eq(addresses.id, id));
  }

  // Waitlist
  async addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const [created] = await db.insert(waitlistEntries).values(entry).returning();
    return created;
  }

  async getWaitlistEntry(email: string): Promise<WaitlistEntry | undefined> {
    const [entry] = await db.select().from(waitlistEntries).where(eq(waitlistEntries.email, email));
    return entry;
  }

  // Newsletter
  async addNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [created] = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return created;
  }

  async getNewsletterSubscriber(email: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return subscriber;
  }

  async getNewsletterSubscriberByToken(token: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.unsubscribeToken, token));
    return subscriber;
  }

  async getActiveNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.status, "active"));
  }

  async updateNewsletterSubscriber(id: string, data: Partial<InsertNewsletterSubscriber>): Promise<NewsletterSubscriber | undefined> {
    const [updated] = await db.update(newsletterSubscribers).set(data).where(eq(newsletterSubscribers.id, id)).returning();
    return updated;
  }

  async unsubscribeNewsletter(token: string): Promise<void> {
    await db.update(newsletterSubscribers).set({
      status: "unsubscribed",
      unsubscribedAt: new Date(),
    }).where(eq(newsletterSubscribers.unsubscribeToken, token));
  }

  // Newsletter Issues
  async createNewsletterIssue(issue: InsertNewsletterIssue): Promise<NewsletterIssue> {
    const [created] = await db.insert(newsletterIssues).values(issue).returning();
    return created;
  }

  async getNewsletterIssues(): Promise<NewsletterIssue[]> {
    return db.select().from(newsletterIssues).orderBy(desc(newsletterIssues.createdAt));
  }

  async updateNewsletterIssue(id: string, data: Partial<InsertNewsletterIssue>): Promise<NewsletterIssue | undefined> {
    const [updated] = await db.update(newsletterIssues).set(data).where(eq(newsletterIssues.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
