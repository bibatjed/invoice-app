import { UserRequest } from "@src/middleware/authMiddleware";
import { createInvoiceType } from "@src/services/invoice/validate";
import { NextFunction, Request, Response } from "express";
import { IInvoiceService } from "@src/services/invoice/Invoice";

class InvoiceController {
  constructor(private readonly userService: IInvoiceService) {}

  createInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.createInvoice((req as UserRequest).user.id, req.body as createInvoiceType);
      return res.json(result);
    } catch (e) {
      return next(e);
    }
  };

  getInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { page, limit, status } = req.query;

      const result = await this.userService.getInvoice((req as UserRequest).user.id, page as string, limit as string, status as string);
      return res.json(result);
    } catch (e) {
      return next(e);
    }
  };

  getDetailedInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { invoice_tag } = req.params;

      const result = await this.userService.getDetailedInvoice((req as UserRequest).user.id, invoice_tag as string);
      return res.json(result);
    } catch (e) {
      return next(e);
    }
  };

  putInvoicePaid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { invoice_tag } = req.params;

      const result = await this.userService.putInvoicePaid((req as UserRequest).user.id, invoice_tag as string);
      return res.json(result);
    } catch (e) {
      return next(e);
    }
  };

  deleteInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { invoice_tag } = req.params;

      const result = await this.userService.deleteInvoice((req as UserRequest).user.id, invoice_tag as string);
      return res.json(result);
    } catch (e) {
      return next(e);
    }
  };
}

export default InvoiceController;
