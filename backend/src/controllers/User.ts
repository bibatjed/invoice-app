import { NextFunction, Request, Response } from "express";

export interface IUserService {
  register: (userDetails: { firstName: string; middleName: string; lastName: string; email: string; password: string }) => any;
}

class UserController {
  constructor(private readonly userService: IUserService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, middleName, lastName, email, password } = req.body;
    try {
      const result = await this.userService.register({ firstName, middleName, lastName, email, password });
      return res.json(result);
    } catch (e) {
      return next(e);
    }
  };
}

export default UserController;
