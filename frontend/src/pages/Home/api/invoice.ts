import http from "@src/http";
export type InvoiceItem = {
  id: number;
  invoice_tag: string;
  total: number;
  status: "pending" | "paid" | "draft";
  bill_to_client_name: string;
  invoice_date: string;
  payment_terms: string;
};
export type GetInvoicesType = {
  result: InvoiceItem[];
  count: number;
  pages: number;
};
export async function getInvoices(): Promise<GetInvoicesType> {
  const result = await http.get("/v1/invoices");

  return result.data;
}
