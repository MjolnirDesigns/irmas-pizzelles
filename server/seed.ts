import { db } from "./db";
import { products, promotions } from "@shared/schema";

export async function seedDatabase() {
  console.log("Seeding database...");

  // Check if products already exist
  const existingProducts = await db.select().from(products);
  if (existingProducts.length > 0) {
    console.log("Products already seeded, skipping...");
  } else {
    // Seed products
    await db.insert(products).values([
      {
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
    ]);
    console.log("Products seeded successfully!");
  }

  // Check if promotions already exist
  const existingPromos = await db.select().from(promotions);
  if (existingPromos.length > 0) {
    console.log("Promotions already seeded, skipping...");
  } else {
    // Seed the FIRST25 promotion
    await db.insert(promotions).values([
      {
        code: "FIRST25",
        description: "25% off for the first 25 orders in 2025",
        discountType: "percentage",
        discountValue: "25",
        maxRedemptions: 25,
        currentRedemptions: 0,
        startsAt: new Date("2025-01-01T00:00:00Z"),
        expiresAt: new Date("2025-12-31T23:59:59Z"),
        isActive: true,
      },
      {
        code: "WELCOME10",
        description: "10% off your first order",
        discountType: "percentage",
        discountValue: "10",
        maxRedemptions: null,
        currentRedemptions: 0,
        isActive: true,
      },
      {
        code: "FREESHIP",
        description: "Free shipping on orders over $30",
        discountType: "fixed",
        discountValue: "7.99",
        minOrderAmount: "30",
        maxRedemptions: null,
        currentRedemptions: 0,
        isActive: true,
      },
    ]);
    console.log("Promotions seeded successfully!");
  }

  console.log("Database seeding complete!");
}

// Run seed if called directly
seedDatabase().catch(console.error);
