import z from "zod";
export const addInvoiceSchema = z.object({
  bill_from_street_address: z.string().min(1, "Street Address is required"),
  bill_from_city: z.string().min(1, "City is required"),
  bill_from_post_code: z.string().min(1, "Post Code is required"),
  bill_from_country: z.string().min(1, "Country is required"),
  bill_to_client_name: z.string().min(1, "Client Name is required"),
  bill_to_client_email: z.string().email("Valid email is required"),
  bill_to_street_address: z.string().min(1, "Street Address is required"),
  bill_to_city: z.string().min(1, "City is required"),
  bill_to_post_code: z.string().min(1, "Post Code is required"),
  bill_to_country: z.string().min(1, "County is required"),
  invoice_date: z.coerce.date(),
  payment_terms: z.enum(["net_1_day", "net_7_days", "net_14_days", "net_30_days"]),
  project_description: z.string().min(1, "Project description is required"),
  invoice_items: z
    .array(
      z.object({
        id: z.number().int().optional(),
        item_name: z.string().min(1, "Item Name is required"),
        quantity: z.coerce.number().int().min(1),
        price: z.coerce.number().int().min(1),
      })
    )
    .min(1),
});

export type AddInvoiceType = z.infer<typeof addInvoiceSchema>;
