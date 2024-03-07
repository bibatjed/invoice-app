import Invoice from "@src/models/Invoice";
import InvoiceItem from "@src/models/InvoiceItem";
import { IRepository } from "@src/repository";
import ErrorService from "@src/utils/ErrorService";
import { calculateOffset, calculatePage } from "@src/utils/pagination";
import { DateOnlyDataType, InferAttributes } from "sequelize";
import generateInvoiceTag from "./generateInvoiceTag";
import { validateCreateInvoice, createInvoiceType, updateInvoiceType, validateUpdateInvoice } from "./validate";

export interface IInvoiceService {
  createInvoice: (user_id: number, invoice: createInvoiceType) => Promise<InferAttributes<Invoice> & { invoice_items: InvoiceItem[] }>;
  getInvoice: (user_id: number, page: string, limit: string, status: string) => Promise<{ count: number; pages: number; result: Invoice[] }>;
  getDetailedInvoice: (user_id: number, invoice_tag: string) => Promise<Invoice>;
  putInvoiceDetails: (user_id: number, invoice_tag: string, invoice: updateInvoiceType) => Promise<any & { invoice_items: InvoiceItem[] }>;
  putInvoicePaid: (user_id: number, invoice_tag: string) => Promise<{ message: string }>;
  deleteInvoice: (user_id: number, invoice_tag: string) => Promise<{ message: string }>;
}
class InvoiceService implements IInvoiceService {
  constructor(private readonly repository: IRepository) {}
  async createInvoice(user_id: number, invoice: createInvoiceType) {
    validateCreateInvoice(invoice);
    const invoiceResult = await this.repository.startTransaction(async (transaction) => {
      //calculate total
      const total = invoice.invoice_items.reduce((acc, value) => acc + value.total, 0);

      const generatedInvoiceTag = await generateInvoiceTag(this.repository.invoice, transaction);
      //create invoice
      const invoiceResult = await this.repository.invoice.createInvoice({ ...invoice, total, invoice_tag: generatedInvoiceTag, user_id }, transaction);

      return {
        ...invoiceResult,
        invoice_items: invoiceResult.invoice_item,
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
      const result = await this.repository.invoice.findInvoiceByTag({ userId: user_id, tag: invoice_tag, includeInvoiceItemList: true, transaction });

      if (!result) {
        throw new ErrorService(404, "Invoice not found");
      }

      return result;
    });

    return invoiceResult;
  }

  async putInvoiceDetails(user_id: number, invoice_tag: string, invoice: updateInvoiceType) {
    validateUpdateInvoice(invoice);
    const invoiceResult = await this.repository.startTransaction(async (transaction) => {
      const result = await this.repository.invoice.findInvoiceByTag({ userId: user_id, tag: invoice_tag, includeInvoiceItemList: true, transaction });

      if (!result) {
        throw new ErrorService(404, "Invoice not found");
      }

      const total = invoice.invoice_items.reduce((acc, value) => acc + value.total, 0);

      await this.repository.invoice.updateInvoice(invoice_tag, { ...invoice, total: total }, transaction);

      // @ts-ignore
      const invoiceItemsArray = result.invoice_items as InvoiceItem[];

      const removeInvoiceItemsId: number[] = [];
      invoiceItemsArray.forEach((val) => {
        if (invoice.invoice_items.find((item) => item?.id === val?.id) == null) {
          removeInvoiceItemsId.push(val.id);
        }
      });

      const invoiceItems = invoice.invoice_items.map((item) => ({
        ...item,
        invoice_id: result.id,
      }));

      const [invoiceItemsUpdate] = await Promise.all([this.repository.invoice.upsertInvoiceItems(invoiceItems, transaction), this.repository.invoice.destroyInvoiceItems(removeInvoiceItemsId, transaction)]);

      return {
        ...invoice,
        id: result.id,
        status: result.status,
        user_id: result.user_id,
        invoice_tag: result.invoice_tag,
        total: total,
        created_at: result.created_at,
        updated_at: result.updated_at,
        deleted_at: result.deleted_at,
        invoice_items: invoiceItemsUpdate,
      };
    });

    return invoiceResult;
  }

  async putInvoicePaid(user_id: number, invoice_tag: string) {
    await this.repository.startTransaction(async (transaction) => {
      const result = await this.repository.invoice.findInvoiceByTag({ userId: user_id, tag: invoice_tag, transaction });

      if (!result) {
        throw new ErrorService(404, "Invoice not found");
      }

      if (result.status === "paid") {
        throw new ErrorService(400, "Invoice is already marked as paid");
      }

      await result.update(
        {
          status: "paid",
        },
        {
          transaction,
        }
      );
    });

    return { message: "Invoice is marked as paid" };
  }

  async deleteInvoice(user_id: number, invoice_tag: string) {
    await this.repository.startTransaction(async (transaction) => {
      const result = await this.repository.invoice.findInvoiceByTag({ userId: user_id, tag: invoice_tag, transaction });

      if (!result) {
        throw new ErrorService(404, "Invoice not found");
      }

      await result.destroy({ force: true, transaction });
    });

    return { message: "Invoice is deleted" };
  }
}

export default InvoiceService;
