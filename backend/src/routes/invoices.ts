import express from "express";
import InvoiceContoller from "@src/controllers/Invoice";
import InvoiceService from "@src/services/invoice/Invoice";
import { IRepository } from "@src/repository";
import authMiddleware from "@src/middleware/authMiddleware";
const router = express.Router();

export default function initializeInvoiceRouter(repository: IRepository) {
  const invoiceService = new InvoiceService(repository);
  const invoiceController = new InvoiceContoller(invoiceService);
  router.route("/").post(authMiddleware(repository), invoiceController.createInvoice).get(authMiddleware(repository), invoiceController.getInvoice);

  router.route("/:invoice_tag").get(authMiddleware(repository), invoiceController.getDetailedInvoice).delete(authMiddleware(repository), invoiceController.deleteInvoice);

  router.route("/:invoice_tag/paid").put(authMiddleware(repository), invoiceController.putInvoicePaid);

  return router;
}
