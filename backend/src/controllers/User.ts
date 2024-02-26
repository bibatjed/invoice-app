import { NextFunction, Request, Response } from "express";

export interface IUserService {
  register: (userDetails: { first_name: string; middle_name: string; last_name: string; email: string; password: string }) => any;
}

class UserController {
  constructor(private readonly userService: IUserService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, middle_name, last_name, email, password } = req.body;
    try {
      const result = await this.userService.register({ first_name, middle_name, last_name, email, password });
      return res.json(result);
    } catch (e) {
      return next(e);
    }
  };
}

export default UserController;
