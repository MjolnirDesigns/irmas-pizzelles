import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_EARLY_BIRD_PERCENT,
  earlyBirdPriceCents,
  type PackSize,
} from "@shared/catalog";

export interface CommerceConfig {
  flavors: Array<{
    id: "anise" | "vanilla";
    name: string;
    epithet: string;
    description: string;
    tasting: string;
    ingredients: string;
  }>;
  packs: Array<{
    id: PackSize;
    cookies: number;
    name: string;
    netWeight: string;
    listPriceCents: number;
    earlyBirdPriceCents: number;
  }>;
  earlyBirdPercent: number;
  stripeConfigured: boolean;
  paymentsMessage: string;
  emailConfigured: boolean;
  databaseConfigured: boolean;
  batchLabel: string;
  batchCapacityDozens: number;
  dozenUnitsReserved: number;
  dozenUnitsRemaining: number;
  preorderOpen: boolean;
  preorderCutoff: string | null;
  cottageDisclosure: string;
  allergenStatement: string;
  fulfillment: {
    pickup: { cents: number; note: string };
    local_delivery: { cents: number; zipPrefixes: string[]; note: string };
    in_state_shipping: { cents: number; note: string };
  };
  tax: { collectedCents: number; note: string };
}

export function useCommerceConfig() {
  return useQuery({
    queryKey: ["commerce-config"],
    queryFn: async (): Promise<CommerceConfig> => {
      const response = await fetch("/api/commerce/config");
      if (!response.ok) throw new Error("Could not load the batch.");
      return response.json();
    },
    staleTime: 30_000,
  });
}

export function priceFor(config: CommerceConfig | undefined, pack: PackSize) {
  const fromApi = config?.packs.find((item) => item.id === pack);
  const list = fromApi?.listPriceCents ?? (pack === "12" ? 1000 : 600);
  const percent = config?.earlyBirdPercent ?? DEFAULT_EARLY_BIRD_PERCENT;
  return {
    list,
    early: fromApi?.earlyBirdPriceCents ?? earlyBirdPriceCents(list, percent),
    percent,
  };
}

export function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
