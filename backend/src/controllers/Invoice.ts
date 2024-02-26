import { UserRequest } from "@src/middleware/authMiddleware";
import { createInvoiceType } from "@src/services/invoice/validate";
import { NextFunction, Request, Response } from "express";
import { IInvoiceService } from "@src/services/invoice/Invoice";

class InvoiceController {
  constructor(private readonly userService: IInvoiceService) {}

  createInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.createInvoice(req.body as createInvoiceType, (req as UserRequest).user.id);
      return res.json(result);
    } catch (e) {
      return next(e);
    }
  };
}

export default InvoiceController;
