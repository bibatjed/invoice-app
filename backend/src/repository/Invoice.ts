import { DateOnlyDataType, InferAttributes, Op, Sequelize, Transaction } from "sequelize";
import Invoice from "@src/models/Invoice";
import InvoiceItem from "@src/models/InvoiceItem";
import { createInvoiceType, updateInvoiceType } from "@src/services/invoice/validate";
type invoiceDetails = {
  total: number;
  invoice_tag: string;
  user_id: number;
} & createInvoiceType;

type InvoiceParams = {
  tag: string;
  userId?: number | null;
  includeInvoiceItemList?: boolean;
  transaction?: Transaction | null;
};

type InvoiceItemPayload = {
  id?: number;
  invoice_id: number;
  item_name: string;
  price: number;
  quantity: number;
  total: number;
};

type updateInvoiceDetails = {
  total: number;
} & updateInvoiceType;

export interface IInvoiceRepositry {
  createInvoice: (invoice: invoiceDetails, transaction: Transaction | null) => Promise<InferAttributes<Invoice> & { invoice_item: InvoiceItem[] }>;
  findInvoiceByTag: (invoiceParams: InvoiceParams) => Promise<Invoice | null>;
  findInvoiceByUserId: (user_id: number, offset: number, limit: number, statusFilter: string[], transaction: Transaction | null) => Promise<{ rows: Invoice[]; count: number }>;
  updateInvoice: (invoice_tag: string, invoice: updateInvoiceDetails, transaction: Transaction | null) => Promise<void>;
  destroyInvoiceItems: (invoiceItemIds: number[], transaction: Transaction | null) => Promise<void>;
  upsertInvoiceItems: (invoice_item: InvoiceItemPayload[], transaction?: Transaction | null) => Promise<InvoiceItem[]>;
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

  async updateInvoice(invoice_tag: string, invoice: updateInvoiceDetails, transaction: Transaction | null) {
    await Invoice.update(
      {
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

        total: invoice.total,
        project_description: invoice.project_description,
        invoice_date: invoice.invoice_date as unknown as DateOnlyDataType,
      },
      {
        where: {
          invoice_tag: invoice_tag,
        },

        transaction,
      }
    );
  }

  async upsertInvoiceItems(invoiceItems: InvoiceItemPayload[], transaction?: Transaction | null) {
    return InvoiceItem.bulkCreate(invoiceItems, {
      updateOnDuplicate: ["invoice_id", "item_name", "price", "quantity", "total"],
      transaction,
      individualHooks: true,
    });
  }

  async destroyInvoiceItems(invoiceItemIds: number[], transaction: Transaction | null) {
    await InvoiceItem.destroy({
      where: { id: { [Op.in]: invoiceItemIds } },
      transaction,
      force: true,
    });
  }

  async findInvoiceByTag({ tag, userId = null, includeInvoiceItemList = false, transaction = null }: InvoiceParams) {
    return Invoice.findOne({
      where: {
        invoice_tag: tag,
        ...(userId && { user_id: userId }),
      },
      ...(includeInvoiceItemList && {
        include: [
          {
            model: InvoiceItem,
            as: "invoice_items",
          },
        ],
      }),
      transaction,
    });
  }

  async findInvoiceByUserId(userId: number, offset: number, limit: number, statusFilter: string[] = [], transaction: Transaction | null) {
    return Invoice.findAndCountAll({
      where: {
        user_id: userId,

        ...(statusFilter.length > 0 && {
          status: {
            [Op.in]: statusFilter,
          },
        }),
      },

      order: [
        ["created_at", "DESC"],
        ["id", "DESC"],
      ],
      offset,
      limit,
      transaction,
    });
  }
}

export default InvoiceRepository;
