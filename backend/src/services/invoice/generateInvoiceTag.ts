import { IInvoiceRepositry } from "@src/repository/Invoice";
import { Transaction } from "sequelize";
import generateCode from "@src/utils/generateCode";

export default async function generateInvoiceTag(invoiceRepository: IInvoiceRepositry, transaction: Transaction): Promise<string> {
  const generatedCode = generateCode();

  const invoiceTagResult = await invoiceRepository.findInvoiceByTag(generatedCode, transaction);

  if (!invoiceTagResult) {
    return generatedCode;
  }

  return generateInvoiceTag(invoiceRepository, transaction);
}
