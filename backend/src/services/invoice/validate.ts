import { z } from "zod";
const createInvoiceSchema = z.object({
  bill_from_street_address: z.string(),
  bill_from_city: z.string(),
  bill_from_post_code: z.string(),
  bill_from_country: z.string(),
  bill_to_client_name: z.string(),
  bill_to_client_email: z.string().email(),
  bill_to_street_address: z.string(),
  bill_to_city: z.string(),
  bill_to_post_code: z.string(),
  bill_to_country: z.string(),
  invoice_date: z.coerce.date(),
  payment_terms: z.enum(["next_1_day", "next_7_days", "next_14_days", "next_30_days"]),
  project_description: z.string(),
  invoice_items: z
    .array(
      z.object({
        item_name: z.string(),
        quantity: z.number(),
        price: z.number(),
        total: z.number(),
      })
    )
    .min(1),
});

export type createInvoiceType = z.infer<typeof createInvoiceSchema>;
export function validateCreateInvoce(userDetails: createInvoiceType) {
  return createInvoiceSchema.parse(userDetails);
}
