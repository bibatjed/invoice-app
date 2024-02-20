import express from "express";
import UserController from "@src/controllers/User";
import UserService from "@src/services/user/User";
import { IRepository } from "@src/repository";
const router = express.Router();

export default function initializeUserRouter(repository: IRepository) {
  const userService = new UserService(repository);
  const userController = new UserController(userService);
  router.post("/register", userController.register);

  return router;
}
