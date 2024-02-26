import { NextFunction, Request, Response } from "express";
import { IUserService } from "@src/services/user/User";

class UserController {
  constructor(private readonly userService: IUserService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, middle_name, last_name, email, password } = req.body;
    try {
      const result = await this.userService.registerUser({ first_name, middle_name, last_name, email, password });
      return res.json(result);
    } catch (e) {
      return next(e);
    }
  };
}

export default UserController;
