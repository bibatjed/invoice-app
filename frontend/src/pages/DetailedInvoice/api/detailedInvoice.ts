import http from "@src/http";
import { AddInvoiceType } from "../../Home/validate";

type InvoiceItem = {
  id: number;
  price: number;
  quantity: number;
  item_name: string;
  total: number;
};

export type GetInvoiceTypeDetailed = Omit<AddInvoiceType, "invoice_items"> & {
  id: number;
  status: "pending" | "paid" | "draft";
  invoice_tag: string;
  invoice_items: InvoiceItem[];
};

export async function getInvoiceDetailed(invoiceTag: string): Promise<GetInvoiceTypeDetailed> {
  const result = await http.get(`/v1/invoices/${invoiceTag}`);

  return result.data;
}

export async function deleteInvoiceDetailed(invoiceTag: string) {
  await http.delete(`/v1/invoices/${invoiceTag}`);
}

export async function markInvoicePaid(invoiceTag: string) {
  await http.put(`/v1/invoices/${invoiceTag}/paid`);
}

// type PostInvoice = Omit<AddInvoiceType, "invoice_items"> & {
//   invoice_items: {
//     item_name: string;
//     quantity: number;
//     price: number;
//     total: number;
//   }[];
// };
