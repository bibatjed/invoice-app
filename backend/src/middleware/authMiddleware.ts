import { verifyJwt } from "@src/jwt/index";
import { IRepository } from "@src/repository/index";
import UserRepository from "@src/repository/User";
import ErrorService from "@src/utils/ErrorService";
import { NextFunction, Request, Response } from "express";

export type UserRequest = {
  user: { id: number };
} & Request;

export default function authMiddleware(repository: IRepository) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jwt = req.headers["authorization"]?.split(" ");

      if (!jwt || !jwt[1]) {
        throw new ErrorService(401, "Invalid token.");
      }

      const decodedToken = await verifyJwt(jwt[1] as string);
      const userResult = await repository.user.findUserById((decodedToken as { id: number }).id as number);

      if (!userResult) {
        throw new ErrorService(401, "You are not authorized to make this call.");
      }

      (req as UserRequest).user = { id: userResult!.id };

      return next();
    } catch (e) {
      return next(e);
    }
  };
}
