import type { IStorage } from "./storage";
import type {
  User, InsertUser,
  Customer, InsertCustomer,
  Product, InsertProduct,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  Promotion,
  Address, InsertAddress,
  WaitlistEntry, InsertWaitlistEntry,
  NewsletterSubscriber, InsertNewsletterSubscriber,
  NewsletterIssue, InsertNewsletterIssue,
} from "@shared/schema";

/**
 * Used when DATABASE_URL is not set. Keeps the existing API and the Asynd
 * checkout runnable on a laptop. Data lives in the process and is lost on restart.
 */
export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private customers: Customer[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private orderItems: OrderItem[] = [];
  private promotions: Promotion[] = [];
  private addresses: Address[] = [];
  private waitlist: WaitlistEntry[] = [];
  private subscribers: NewsletterSubscriber[] = [];
  private issues: NewsletterIssue[] = [];

  constructor() {
    const now = new Date();
    this.products = LEGACY_PRODUCTS.map((product) => ({ ...product, createdAt: now }));
    this.promotions = LEGACY_PROMOTIONS.map((promo) => ({ ...promo, createdAt: now }));
  }

  async getUser(id: string) {
    return this.users.find((user) => user.id === id);
  }
  async getUserByReplitId(replitId: string) {
    return this.users.find((user) => user.replitId === replitId);
  }
  async getUserByEmail(email: string) {
    return this.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }
  async createUser(insertUser: InsertUser) {
    const user: User = {
      id: crypto.randomUUID(),
      replitId: insertUser.replitId ?? null,
      email: insertUser.email,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      profileImageUrl: insertUser.profileImageUrl ?? null,
      stripeCustomerId: insertUser.stripeCustomerId ?? null,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }
  async updateUser(id: string, data: Partial<InsertUser>) {
    const user = await this.getUser(id);
    if (!user) return undefined;
    Object.assign(user, data);
    return user;
  }

  async getCustomerByEmail(email: string) {
    return this.customers.find((customer) => customer.email === email.toLowerCase());
  }
  async upsertCustomer(data: InsertCustomer) {
    const email = data.email.toLowerCase();
    const existing = await this.getCustomerByEmail(email);
    if (existing) {
      Object.assign(existing, { ...data, email, updatedAt: new Date() });
      return existing;
    }
    const customer: Customer = {
      id: crypto.randomUUID(),
      email,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      phone: data.phone ?? null,
      preferredFlavor: data.preferredFlavor ?? null,
      preferredPackSize: data.preferredPackSize ?? null,
      wouldReorderMonthly: data.wouldReorderMonthly ?? null,
      thirdFlavorIdea: data.thirdFlavorIdea ?? null,
      marketingOptIn: data.marketingOptIn ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.customers.push(customer);
    return customer;
  }
  async getCustomers() {
    return [...this.customers].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getProducts(activeOnly = true) {
    return activeOnly ? this.products.filter((product) => product.isActive) : [...this.products];
  }
  async getProductById(id: string) {
    return this.products.find((product) => product.id === id);
  }
  async getProductBySlug(slug: string) {
    return this.products.find((product) => product.slug === slug);
  }
  async getFeaturedProducts() {
    return this.products.filter((product) => product.isActive && product.isFeatured);
  }
  async createProduct(product: InsertProduct) {
    const created: Product = {
      id: crypto.randomUUID(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription ?? null,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? null,
      imageUrl: product.imageUrl ?? null,
      category: product.category ?? "pizzelle",
      flavor: product.flavor ?? null,
      size: product.size ?? null,
      weight: product.weight ?? null,
      inventory: product.inventory ?? 100,
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false,
      createdAt: new Date(),
    };
    this.products.push(created);
    return created;
  }
  async updateProduct(id: string, data: Partial<InsertProduct>) {
    const product = await this.getProductById(id);
    if (!product) return undefined;
    Object.assign(product, data);
    return product;
  }

  async getOrders() {
    return [...this.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getOrderById(id: string) {
    return this.orders.find((order) => order.id === id);
  }
  async getOrderByOrderNumber(orderNumber: string) {
    return this.orders.find((order) => order.orderNumber === orderNumber);
  }
  async getOrdersByUserId(userId: string) {
    return this.orders.filter((order) => order.userId === userId);
  }
  async createOrder(order: InsertOrder) {
    const now = new Date();
    const created: Order = {
      id: crypto.randomUUID(),
      orderNumber: `IP${Date.now().toString(36).toUpperCase()}`,
      userId: order.userId ?? null,
      email: order.email,
      status: order.status ?? "pending",
      subtotal: order.subtotal,
      discountAmount: order.discountAmount ?? "0",
      shippingAmount: order.shippingAmount ?? "0",
      taxAmount: order.taxAmount ?? "0",
      total: order.total,
      promoCode: order.promoCode ?? null,
      promoDiscount: order.promoDiscount ?? null,
      stripePaymentIntentId: order.stripePaymentIntentId ?? null,
      stripeCheckoutSessionId: order.stripeCheckoutSessionId ?? null,
      stripeCustomerId: order.stripeCustomerId ?? null,
      paymentState: order.paymentState ?? "pending",
      customerId: order.customerId ?? null,
      fulfillmentMethod: order.fulfillmentMethod ?? null,
      isPreorder: order.isPreorder ?? false,
      earlyBirdPercent: order.earlyBirdPercent ?? null,
      batchLabel: order.batchLabel ?? null,
      variant: order.variant ?? null,
      shippingName: order.shippingName ?? null,
      shippingStreet: order.shippingStreet ?? null,
      shippingCity: order.shippingCity ?? null,
      shippingState: order.shippingState ?? null,
      shippingZipCode: order.shippingZipCode ?? null,
      shippingCountry: order.shippingCountry ?? null,
      shippingPhone: order.shippingPhone ?? null,
      trackingNumber: order.trackingNumber ?? null,
      trackingCarrier: order.trackingCarrier ?? null,
      customerNotes: order.customerNotes ?? null,
      adminNotes: order.adminNotes ?? null,
      createdAt: now,
      updatedAt: now,
      paidAt: order.paidAt ?? null,
      shippedAt: order.shippedAt ?? null,
      deliveredAt: order.deliveredAt ?? null,
    };
    this.orders.unshift(created);
    return created;
  }
  async updateOrder(id: string, data: Partial<InsertOrder>) {
    const order = await this.getOrderById(id);
    if (!order) return undefined;
    Object.assign(order, data, { updatedAt: new Date() });
    return order;
  }

  async getOrderItems(orderId: string) {
    return this.orderItems.filter((item) => item.orderId === orderId);
  }
  async createOrderItem(item: InsertOrderItem) {
    const created: OrderItem = {
      id: crypto.randomUUID(),
      orderId: item.orderId,
      productId: item.productId,
      productName: item.productName,
      productPrice: item.productPrice,
      quantity: item.quantity,
      total: item.total,
      flavor: item.flavor ?? null,
      packSize: item.packSize ?? null,
    };
    this.orderItems.push(created);
    return created;
  }

  async getPromotionByCode(code: string) {
    return this.promotions.find(
      (promo) => promo.isActive && promo.code.toUpperCase() === code.toUpperCase(),
    );
  }
  async incrementPromotionRedemptions(id: string) {
    const promo = this.promotions.find((item) => item.id === id);
    if (promo) promo.currentRedemptions = (promo.currentRedemptions ?? 0) + 1;
  }

  async getAddressesByUserId(userId: string) {
    return this.addresses.filter((address) => address.userId === userId);
  }
  async createAddress(address: InsertAddress) {
    const created: Address = {
      id: crypto.randomUUID(),
      userId: address.userId,
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country ?? "USA",
      phone: address.phone ?? null,
      isDefault: address.isDefault ?? false,
      createdAt: new Date(),
    };
    this.addresses.push(created);
    return created;
  }
  async updateAddress(id: string, data: Partial<InsertAddress>) {
    const address = this.addresses.find((item) => item.id === id);
    if (!address) return undefined;
    Object.assign(address, data);
    return address;
  }
  async deleteAddress(id: string) {
    this.addresses = this.addresses.filter((address) => address.id !== id);
  }

  async addToWaitlist(entry: InsertWaitlistEntry) {
    const created: WaitlistEntry = {
      id: crypto.randomUUID(),
      email: entry.email,
      name: entry.name ?? null,
      createdAt: new Date(),
    };
    this.waitlist.push(created);
    return created;
  }
  async getWaitlistEntry(email: string) {
    return this.waitlist.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  }

  async addNewsletterSubscriber(subscriber: InsertNewsletterSubscriber) {
    const created: NewsletterSubscriber = {
      id: crypto.randomUUID(),
      email: subscriber.email,
      firstName: subscriber.firstName ?? null,
      status: subscriber.status ?? "active",
      unsubscribeToken: subscriber.unsubscribeToken,
      subscribedAt: new Date(),
      unsubscribedAt: null,
    };
    this.subscribers.push(created);
    return created;
  }
  async getNewsletterSubscriber(email: string) {
    return this.subscribers.find((subscriber) => subscriber.email.toLowerCase() === email.toLowerCase());
  }
  async getNewsletterSubscriberByToken(token: string) {
    return this.subscribers.find((subscriber) => subscriber.unsubscribeToken === token);
  }
  async getActiveNewsletterSubscribers() {
    return this.subscribers.filter((subscriber) => subscriber.status === "active");
  }
  async updateNewsletterSubscriber(id: string, data: Partial<InsertNewsletterSubscriber>) {
    const subscriber = this.subscribers.find((item) => item.id === id);
    if (!subscriber) return undefined;
    Object.assign(subscriber, data);
    return subscriber;
  }
  async unsubscribeNewsletter(token: string) {
    const subscriber = await this.getNewsletterSubscriberByToken(token);
    if (!subscriber) return;
    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date();
  }

  async createNewsletterIssue(issue: InsertNewsletterIssue) {
    const created: NewsletterIssue = {
      id: crypto.randomUUID(),
      subject: issue.subject,
      previewText: issue.previewText ?? null,
      htmlBody: issue.htmlBody,
      textBody: issue.textBody ?? null,
      status: issue.status ?? "draft",
      scheduledSendAt: issue.scheduledSendAt ?? null,
      sentAt: null,
      recipientCount: 0,
      createdAt: new Date(),
    };
    this.issues.unshift(created);
    return created;
  }
  async getNewsletterIssues() {
    return [...this.issues];
  }
  async updateNewsletterIssue(id: string, data: Partial<InsertNewsletterIssue>) {
    const issue = this.issues.find((item) => item.id === id);
    if (!issue) return undefined;
    Object.assign(issue, data);
    return issue;
  }
}

const LEGACY_PRODUCTS: Omit<Product, "createdAt">[] = [
  {
    id: "legacy-classic-vanilla",
    name: "Classic Vanilla Pizzelles",
    slug: "classic-vanilla",
    description: "Our signature vanilla pizzelles made with Irma's original family recipe. Light, crispy, and delicately flavored with pure vanilla extract. Perfect for dunking in coffee or enjoying on their own.",
    shortDescription: "Light & crispy with pure vanilla",
    price: "14.99",
    compareAtPrice: "18.99",
    imageUrl: "/images/vanilla-pizzelle.jpg",
    category: "pizzelle",
    flavor: "vanilla",
    size: "12 cookies",
    weight: "8 oz",
    inventory: 100,
    isActive: true,
    isFeatured: true,
  },
  {
    id: "legacy-anise-traditional",
    name: "Anise Pizzelles",
    slug: "anise-traditional",
    description: "Traditional Italian pizzelles flavored with authentic anise seed. A beloved classic that brings the taste of old-world Italy to your table. The subtle licorice flavor pairs beautifully with espresso.",
    shortDescription: "Traditional anise seed flavor",
    price: "14.99",
    compareAtPrice: "18.99",
    imageUrl: "/images/anise-pizzelle.jpg",
    category: "pizzelle",
    flavor: "anise",
    size: "12 cookies",
    weight: "8 oz",
    inventory: 100,
    isActive: true,
    isFeatured: true,
  },
  {
    id: "legacy-cinnamon-brown-sugar",
    name: "Cinnamon & Brown Sugar Pizzelles",
    slug: "cinnamon-brown-sugar",
    description: "Warm, comforting pizzelles infused with aromatic cinnamon and rich brown sugar. A cozy treat that fills your kitchen with the scent of home baking. Perfect with hot cocoa or apple cider.",
    shortDescription: "Warm cinnamon & sweet brown sugar",
    price: "15.99",
    compareAtPrice: "19.99",
    imageUrl: "/images/cinnamon-pizzelle.jpg",
    category: "pizzelle",
    flavor: "cinnamon",
    size: "12 cookies",
    weight: "8 oz",
    inventory: 85,
    isActive: true,
    isFeatured: true,
  },
  {
    id: "legacy-chocolate-decadent",
    name: "Chocolate Pizzelles",
    slug: "chocolate-decadent",
    description: "Rich, decadent chocolate pizzelles made with premium cocoa. A modern twist on the classic that satisfies any chocolate lover's cravings while maintaining the traditional crispy texture.",
    shortDescription: "Rich cocoa indulgence",
    price: "16.99",
    compareAtPrice: "20.99",
    imageUrl: "/images/chocolate-pizzelle.jpg",
    category: "pizzelle",
    flavor: "chocolate",
    size: "12 cookies",
    weight: "8 oz",
    inventory: 75,
    isActive: true,
    isFeatured: true,
  },
];

const LEGACY_PROMOTIONS: Omit<Promotion, "createdAt">[] = [
  {
    id: "legacy-promo-first25",
    code: "FIRST25",
    description: "25% off for the first 25 orders in 2025",
    discountType: "percentage",
    discountValue: "25",
    minOrderAmount: null,
    maxRedemptions: 25,
    currentRedemptions: 0,
    startsAt: new Date("2025-01-01T00:00:00Z"),
    expiresAt: new Date("2025-12-31T23:59:59Z"),
    isActive: true,
  },
  {
    id: "legacy-promo-welcome10",
    code: "WELCOME10",
    description: "10% off your first order",
    discountType: "percentage",
    discountValue: "10",
    minOrderAmount: null,
    maxRedemptions: null,
    currentRedemptions: 0,
    startsAt: null,
    expiresAt: null,
    isActive: true,
  },
  {
    id: "legacy-promo-freeship",
    code: "FREESHIP",
    description: "Free shipping on orders over $30",
    discountType: "fixed",
    discountValue: "7.99",
    minOrderAmount: "30",
    maxRedemptions: null,
    currentRedemptions: 0,
    startsAt: null,
    expiresAt: null,
    isActive: true,
  },
];
