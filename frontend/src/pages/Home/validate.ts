import z from "zod";
export const addInvoiceSchema = z.object({
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
  payment_terms: z.enum(["net_1_day", "net_7_days", "net_14_days", "net_30_days"]),
  project_description: z.string(),
  invoice_items: z
    .array(
      z.object({
        id: z.number().int().optional(),
        item_name: z.string(),
        quantity: z.coerce.number().int().min(1),
        price: z.coerce.number().int().min(1),
      })
    )
    .min(1),
});

export type AddInvoiceType = z.infer<typeof addInvoiceSchema>;
