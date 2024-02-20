import express from "express";
import AuthController from "@src/controllers/Auth";
import AuthService from "@src/services/auth/Auth";
import { IRepository } from "@src/repository";
const router = express.Router();
export default function intializeAuthRouter(repository: IRepository) {
  const authService = new AuthService(repository);
  const authController = new AuthController(authService);

  router.post("/login", authController.login);

  router.post("/refresh-token", authController.refreshToken);
  return router;
}
