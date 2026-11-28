/**
 * Launch catalog for the Asynd variants.
 * Prices are integer cents. The legacy /shop catalog is unchanged.
 * Do not add a USDA certification claim. The bakery is not certified.
 */

export const COTTAGE_FOOD_DISCLOSURE =
  "Made in a cottage food operation that is not subject to Florida's food safety regulations.";

export const ALLERGEN_STATEMENT = "CONTAINS: WHEAT, EGG, MILK.";

export const INGREDIENTS_ANISE =
  "Unbleached Wheat Flour, Eggs, Cane Sugar, Butter (Cream), Contains 2% or less of: Baking Powder (Corn Starch, Sodium Bicarbonate, Sodium Aluminum Sulfate, Monocalcium Phosphate), Anise Extract (Alcohol, Water, Oil of Anise).";

export const INGREDIENTS_VANILLA =
  "Unbleached Wheat Flour, Eggs, Cane Sugar, Butter (Cream), Contains 2% or less of: Baking Powder (Corn Starch, Sodium Bicarbonate, Sodium Aluminum Sulfate, Monocalcium Phosphate), Vanilla Extract.";

export const NUTRITION = {
  servingSize: "1 pizzelle (20 g)",
  servingsNote: "FDA-rounded estimates from USDA FoodData Central. Confirm with a lab panel before printing a retail Nutrition Facts label.",
  calories: 80,
  totalFat: "3.5g",
  satFat: "2g",
  transFat: "0g",
  cholesterol: "30mg",
  sodium: "110mg",
  totalCarb: "10g",
  fiber: "0g",
  totalSugars: "4g",
  addedSugars: "4g",
  protein: "2g",
} as const;

export type FlavorId = "anise" | "vanilla";
export type PackSize = "6" | "12";
export type FulfillmentMethod = "pickup" | "local_delivery" | "in_state_shipping";

export interface Flavor {
  id: FlavorId;
  name: string;
  epithet: string;
  description: string;
  tasting: string;
  ingredients: string;
  /** Warm cream tint used by the procedural wafer. */
  tint: string;
  pattern: string;
}

export const FLAVORS: Flavor[] = [
  {
    id: "anise",
    name: "Anise",
    epithet: "The classic iron",
    description:
      "A five-inch Italian wafer pressed thin, with the clean licorice scent of anise extract. The cookie Irma's iron was built around.",
    tasting: "Cool, floral, and barely sweet. Best beside espresso.",
    ingredients: INGREDIENTS_ANISE,
    tint: "#f0e6d2",
    pattern: "#8a7048",
  },
  {
    id: "vanilla",
    name: "Vanilla",
    epithet: "The quiet one",
    description:
      "The same batter, the same iron, finished with pure vanilla extract. Lighter on the nose, warmer on the finish.",
    tasting: "Soft vanilla, browned butter, a clean snap.",
    ingredients: INGREDIENTS_VANILLA,
    tint: "#f6e4c4",
    pattern: "#a68455",
  },
];

export interface Pack {
  id: PackSize;
  cookies: number;
  listPriceCents: number;
  name: string;
  netWeight: string;
  /** Dozen-equivalents, for batch capacity. */
  dozenUnits: number;
}

export const PACKS: Pack[] = [
  {
    id: "6",
    cookies: 6,
    listPriceCents: 600,
    name: "Six",
    netWeight: "Net Wt 4.2 oz (119 g)",
    dozenUnits: 0.5,
  },
  {
    id: "12",
    cookies: 12,
    listPriceCents: 1000,
    name: "Dozen",
    netWeight: "Net Wt 8.4 oz (238 g)",
    dozenUnits: 1,
  },
];

export const DEFAULT_EARLY_BIRD_PERCENT = 18;
export const DEFAULT_BATCH_CAPACITY_DOZENS = 80;
export const DEFAULT_BATCH_LABEL = "Soft launch — Batch 01";

export const PICKUP_NOTE =
  "Local pickup in the Tampa Bay area. We confirm the address and a pickup window by email. No charge for pickup.";

export const LOCAL_DELIVERY_CENTS = 500;
export const SHIPPING_CENTS = 800;

/** Tampa Bay ZIP prefixes. Override with LOCAL_DELIVERY_ZIPS. */
export const DEFAULT_LOCAL_DELIVERY_ZIPS = ["335", "336", "337", "338", "342", "346"];

export function earlyBirdPriceCents(listPriceCents: number, percent: number): number {
  const discounted = Math.round(listPriceCents * (100 - percent)) / 100;
  return Math.round(discounted);
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function flavorById(id: string): Flavor | undefined {
  return FLAVORS.find((flavor) => flavor.id === id);
}

export function packById(id: string): Pack | undefined {
  return PACKS.find((pack) => pack.id === id);
}

export function isFloridaState(state: string | undefined | null): boolean {
  if (!state) return false;
  const normalized = state.trim().toLowerCase();
  return normalized === "fl" || normalized === "florida";
}

export function isFloridaZip(zip: string | undefined | null): boolean {
  if (!zip) return false;
  const digits = zip.replace(/\D/g, "").slice(0, 5);
  if (digits.length < 5) return false;
  const prefix = Number(digits.slice(0, 3));
  return prefix >= 320 && prefix <= 349;
}
