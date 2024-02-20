import express from "express";
import initializeRepository from "@src/repository";
import initializeUserRouter from "./user";
import initializeAuthRouter from "./auth";
const router = express.Router();
const repository = initializeRepository();

const userRouter = initializeUserRouter(repository);
const authRouter = initializeAuthRouter(repository);

router.use("/users", userRouter);

router.use("/auth", authRouter);

export default router;
