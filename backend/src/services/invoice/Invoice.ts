import Invoice from "@src/models/Invoice";
import InvoiceItem from "@src/models/InvoiceItem";
import { IRepository } from "@src/repository";
import ErrorService from "@src/utils/ErrorService";
import { calculateOffset, calculatePage } from "@src/utils/pagination";
import { InferAttributes } from "sequelize";
import generateInvoiceTag from "./generateInvoiceTag";
import { validateCreateInvoce, createInvoiceType } from "./validate";

export interface IInvoiceService {
  createInvoice: (user_id: number, invoice: createInvoiceType) => Promise<InferAttributes<Invoice> & { invoice_item: InvoiceItem[] }>;
  getInvoice: (user_id: number, page: string, limit: string, status: string) => Promise<{ count: number; pages: number; result: Invoice[] }>;
  getDetailedInvoice: (user_id: number, invoice_tag: string) => Promise<Invoice>;
  putInvoicePaid: (user_id: number, invoice_tag: string) => Promise<{ message: string }>;
  deleteInvoice: (user_id: number, invoice_tag: string) => Promise<{ message: string }>;
}
class InvoiceService implements IInvoiceService {
  constructor(private readonly repository: IRepository) {}
  async createInvoice(user_id: number, invoice: createInvoiceType) {
    validateCreateInvoce(invoice);
    const invoiceResult = await this.repository.startTransaction(async (transaction) => {
      //calculate total
      const total = invoice.invoice_items.reduce((acc, value) => acc + value.total, 0);

      const generatedInvoiceTag = await generateInvoiceTag(this.repository.invoice, transaction);
      //create invoice
      const invoiceResult = await this.repository.invoice.createInvoice({ ...invoice, total, invoice_tag: generatedInvoiceTag, user_id }, transaction);

      return {
        ...invoiceResult,
        invoice_item: invoiceResult.invoice_item,
      };
    });

    return invoiceResult;
  }

  async getInvoice(user_id: number, page: string = "1", limit: string = "10", statusFilter: string = "") {
    let paginationPage = 1;
    let paginationLimit = 10;
    let arrStatusFilter: string[] = statusFilter.split(",");
    arrStatusFilter = arrStatusFilter.filter((val) => ["pending", "paid", "draft"].includes(val));
    if (!isNaN(Number(page))) {
      paginationPage = Number(page);
    }

    if (isNaN(Number(limit))) {
      paginationLimit = Number(limit);
    }

    const invoiceResult = await this.repository.startTransaction(async (transaction) => {
      const offset = calculateOffset(paginationPage, paginationLimit);

      const result = await this.repository.invoice.findInvoiceByUserId(user_id, offset, paginationLimit, arrStatusFilter, transaction);

      return {
        result: result.rows,
        count: result.count,
        pages: calculatePage(result.count, paginationLimit),
      };
    });

    return invoiceResult;
  }

  async getDetailedInvoice(user_id: number, invoice_tag: string) {
    const invoiceResult = await this.repository.startTransaction(async (transaction) => {
      const result = await this.repository.invoice.findInvoiceByTag({ user_id: user_id, tag: invoice_tag, includeInvoiceItemList: true, transaction });

      if (!result) {
        throw new ErrorService(404, "Invoice not found");
      }

      return result;
    });

    return invoiceResult;
  }

  async putInvoicePaid(user_id: number, invoice_tag: string) {
    await this.repository.startTransaction(async (transaction) => {
      const result = await this.repository.invoice.findInvoiceByTag({ user_id: user_id, tag: invoice_tag, transaction });

      if (!result) {
        throw new ErrorService(404, "Invoice not found");
      }

      if (result.status === "paid") {
        throw new ErrorService(400, "Invoice is already marked as paid");
      }

      await result.update({
        status: "paid",
      });
    });

    return { message: "Invoice is marked as paid" };
  }

  async deleteInvoice(user_id: number, invoice_tag: string) {
    await this.repository.startTransaction(async (transaction) => {
      const result = await this.repository.invoice.findInvoiceByTag({ user_id: user_id, tag: invoice_tag, transaction });

      if (!result) {
        throw new ErrorService(404, "Invoice not found");
      }

      await result.destroy({ force: true, transaction });
    });

    return { message: "Invoice is deleted" };
  }
}

export default InvoiceService;
