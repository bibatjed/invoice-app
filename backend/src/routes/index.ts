import express from "express";
import initializeRepository from "@src/repository";
import initializeUserRouter from "./user";
import initializeAuthRouter from "./auth";
import initializeInvoiceRouter from "./invoices";
const router = express.Router();
const repository = initializeRepository();

const userRouter = initializeUserRouter(repository);
const authRouter = initializeAuthRouter(repository);
const invoiceRouter = initializeInvoiceRouter(repository);

router.use("/users", userRouter);

router.use("/auth", authRouter);

router.use("/invoices", invoiceRouter);

export default router;
