import { DateOnlyDataType, InferAttributes, Op, Sequelize, Transaction } from "sequelize";
import Invoice from "@src/models/Invoice";
import InvoiceItem from "@src/models/InvoiceItem";
import { createInvoiceType } from "@src/services/invoice/validate";
type invoiceDetails = {
  total: number;
  invoice_tag: string;
  user_id: number;
} & createInvoiceType;
export interface IInvoiceRepositry {
  createInvoice: (invoice: invoiceDetails, transaction: Transaction | null) => Promise<InferAttributes<Invoice> & { invoice_item: InvoiceItem[] }>;
  findInvoiceByTag: (tag: string, transaction: Transaction | null) => Promise<Invoice | null>;
  findInvoiceByUserId: (user_id: number, offset: number, limit: number, statusFilter: string[], transaction: Transaction | null) => Promise<{ rows: Invoice[]; count: number }>;
}

class InvoiceRepository implements IInvoiceRepositry {
  async createInvoice(invoice: invoiceDetails, transaction: Transaction | null = null) {
    const invoiceResult = await Invoice.create(
      {
        user_id: invoice.user_id,
        invoice_tag: invoice.invoice_tag,
        bill_from_city: invoice.bill_from_city,
        bill_from_country: invoice.bill_from_country,
        bill_from_post_code: invoice.bill_from_post_code,
        bill_from_street_address: invoice.bill_from_street_address,
        bill_to_city: invoice.bill_to_city,
        bill_to_client_email: invoice.bill_to_client_email,
        bill_to_country: invoice.bill_to_country,
        bill_to_client_name: invoice.bill_to_client_name,
        bill_to_post_code: invoice.bill_to_post_code,
        bill_to_street_address: invoice.bill_to_street_address,
        payment_terms: invoice.payment_terms,

        // todo: make it dynamic
        status: "pending",
        total: invoice.total,
        project_description: invoice.project_description,
        invoice_date: invoice.invoice_date as unknown as DateOnlyDataType,
      },
      {
        transaction,
      }
    );

    const invoiceItemPayload = invoice.invoice_items.map((val) => {
      return { invoice_id: invoiceResult.id, ...val };
    });
    const invoiceItemResult = await InvoiceItem.bulkCreate(invoiceItemPayload, {
      transaction,
    });

    return {
      ...invoiceResult.dataValues,
      invoice_item: invoiceItemResult,
    };
  }

  async findInvoiceByTag(tag: string, transaction: Transaction | null) {
    return Invoice.findOne({
      where: {
        invoice_tag: tag,
      },
      transaction,
    });
  }

  async findInvoiceByUserId(user_id: number, offset: number, limit: number, statusFilter: string[] = [], transaction: Transaction | null) {
    return Invoice.findAndCountAll({
      where: {
        user_id: user_id,

        ...(statusFilter.length > 0 && {
          status: {
            [Op.in]: statusFilter,
          },
        }),
      },
      offset,
      limit,
      transaction,
    });
  }
}

export default InvoiceRepository;
