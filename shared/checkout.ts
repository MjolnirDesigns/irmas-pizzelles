import { z } from "zod";
import { isFloridaState, isFloridaZip } from "./catalog";

export const commerceCheckoutSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email."),
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    phone: z.string().trim().min(7, "A phone number is required so we can confirm the batch."),
    items: z
      .array(
        z.object({
          flavor: z.enum(["anise", "vanilla"]),
          packSize: z.enum(["6", "12"]),
          quantity: z.number().int().min(1).max(12),
        }),
      )
      .min(1, "Choose at least one pack."),
    fulfillment: z.enum(["pickup", "local_delivery", "in_state_shipping"]),
    address: z
      .object({
        street: z.string().trim().optional(),
        city: z.string().trim().optional(),
        state: z.string().trim().optional(),
        zipCode: z.string().trim().optional(),
      })
      .optional(),
    wouldReorderMonthly: z.boolean().optional(),
    thirdFlavorIdea: z.string().trim().max(200).optional(),
    customerNotes: z.string().trim().max(500).optional(),
    marketingOptIn: z.boolean().optional(),
    variant: z.enum(["atelier", "heritage", "experience"]).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.fulfillment === "pickup") return;
    const address = value.address;
    if (!address?.street || !address.city || !address.state || !address.zipCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A complete Florida address is required for delivery and shipping.",
        path: ["address"],
      });
      return;
    }
    if (!isFloridaState(address.state) || !isFloridaZip(address.zipCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Under Florida cottage food rules this batch can only be picked up, delivered locally, or shipped inside Florida.",
        path: ["address", "state"],
      });
    }
  });

export type CommerceCheckoutInput = z.infer<typeof commerceCheckoutSchema>;

export const surveySchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  firstName: z.string().trim().max(80).optional(),
  preferredFlavor: z.enum(["anise", "vanilla"]).optional(),
  preferredPackSize: z.enum(["6", "12"]).optional(),
  wouldReorderMonthly: z.boolean().optional(),
  thirdFlavorIdea: z.string().trim().max(200).optional(),
  marketingOptIn: z.boolean().optional(),
  variant: z.string().max(40).optional(),
});

export type SurveyInput = z.infer<typeof surveySchema>;
