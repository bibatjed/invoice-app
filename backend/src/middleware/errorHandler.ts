import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export default function (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
  return res.status(500).json({
    message: "Something went wrong",
  });
}
