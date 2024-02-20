import { NextFunction, Request, Response } from "express";

export interface IAuthService {
  login: (loginDetails: { email: string; password: string }) => Promise<{ message: string; jwt: string; refreshToken: string }>;
  refreshToken: (token: string) => Promise<{ message: string; jwt: string; refreshToken: string }>;
}

class AuthController {
  constructor(private readonly authService: IAuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const result = await this.authService.login({ email, password });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
      });
      return res.json({
        message: result.message,
        token: result.jwt,
      });
    } catch (e) {
      return next(e);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.refreshToken(req.cookies["refreshToken"]);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
      });

      return res.json({
        message: result.message,
        token: result.jwt,
      });
    } catch (e) {
      return next(e);
    }
  };
}

export default AuthController;
