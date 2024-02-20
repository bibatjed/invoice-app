import express from "express";
import initializeRepository from "@src/repository";
import initializeUserRouter from "./user";
const router = express.Router();
const repository = initializeRepository();
const userRouter = initializeUserRouter(repository);

export default router;
