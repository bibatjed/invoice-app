import { IInvoiceService } from "@src/controllers/Invoice";
import { IRepository } from "@src/repository";
import generateInvoiceTag from "./generateInvoiceTag";
import { validateCreateInvoce, createInvoiceType } from "./validate";
class InvoiceService implements IInvoiceService {
  constructor(private readonly repository: IRepository) {}
  async createInvoice(invoice: createInvoiceType, user_id: number) {
    validateCreateInvoce(invoice);
    await this.repository.startTransaction(async (transaction) => {
      //calculate total
      const total = invoice.invoice_items.reduce((acc, value) => acc + value.total, 0);

      const generatedInvoiceTag = await generateInvoiceTag(this.repository.invoice, transaction);
      //create invoice
      const invoiceReulst = await this.repository.invoice.createInvoice({ ...invoice, total, invoice_tag: generatedInvoiceTag, user_id }, transaction);
    });

    return { message: "Invoice is created" };
  }
}

export default InvoiceService;
