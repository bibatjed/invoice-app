import { IRepository } from "@src/repository";
import { calculateOffset, calculatePage } from "@src/utils/pagination";
import generateInvoiceTag from "./generateInvoiceTag";
import { validateCreateInvoce, createInvoiceType } from "./validate";

export interface IInvoiceService {
  createInvoice: (user_id: number, invoice: createInvoiceType) => any;
  getInvoice: (user_id: number, page: string, limit: string) => any;
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

  async getInvoice(user_id: number, page: string = "1", limit: string = "10") {
    let paginationPage = 1;
    let paginationLimit = 10;

    if (!isNaN(Number(page))) {
      paginationPage = Number(page);
    }

    if (isNaN(Number(limit))) {
      paginationLimit = Number(limit);
    }
    const invoiceResult = await this.repository.startTransaction(async (transaction) => {
      const offset = calculateOffset(paginationPage, paginationLimit);

      const result = await this.repository.invoice.findInvoiceByUserId(user_id, offset, paginationLimit, transaction);

      return {
        result: result.rows,
        count: result.count,
        pages: calculatePage(result.count, paginationLimit),
      };
    });

    return invoiceResult;
  }
}

export default InvoiceService;
