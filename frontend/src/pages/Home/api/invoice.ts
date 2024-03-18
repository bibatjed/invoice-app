import http from "@src/http";
import { AddInvoiceType } from "../validate";
export type InvoiceItem = {
  id: number;
  invoice_tag: string;
  total: number;
  status: "pending" | "paid" | "draft";
  bill_to_client_name: string;
  invoice_date: string;
  payment_terms: "net_1_day" | "net_7_days" | "net_14_days" | "net_30_days";
};
export type GetInvoicesType = {
  result: InvoiceItem[];
  count: number;
  pages: number;
};
export async function getInvoices(statusFilter: string = "", page: number = 1): Promise<GetInvoicesType> {
  const result = await http.get("/v1/invoices", {
    params: {
      page,
      ...(statusFilter && { status: statusFilter }),
    },
  });

  return result.data;
}

export type PostInvoice = Omit<AddInvoiceType, "invoice_items"> & {
  invoice_items: {
    item_name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
};

export async function postInvoice(data: PostInvoice) {
  return http.post("/v1/invoices", {
    ...data,
  });
}
