import { IAuthService } from "@src/controllers/Auth";
import { JWT, generateJwt, generateRefreshToken, verifyJwt } from "@src/jwt";
import { IRepository } from "@src/repository";
import ErrorService from "@src/utils/ErrorService";
import { validateLogin } from "./validate";

class AuthService implements IAuthService {
  constructor(private readonly repository: IRepository) {}

  login = async (loginDetails: { email: string; password: string }) => {
    validateLogin(loginDetails);
    const { jwt, refreshToken } = await this.repository.startTransaction(async (transaction) => {
      const userResult = await this.repository.user.findUserByEmail(loginDetails.email, transaction);

      if (!userResult) throw new ErrorService(401, "Invalid email or password");

      const isPasswordCorrect = await userResult.comparePassword(loginDetails.password);

      if (!isPasswordCorrect) throw new ErrorService(401, "Invalid email or password");

      const [jwt, refreshToken] = await Promise.all([generateJwt({ id: userResult.id }), generateRefreshToken({ id: userResult.id })]);
      return { jwt, refreshToken };
    });

    return { message: "Success", jwt, refreshToken };
  };

  refreshToken = async (token: string) => {
    const { jwt, refreshToken } = await this.repository.startTransaction(async (transaction) => {
      const jwt = (await verifyJwt(token)) as JWT;
      const userResult = await this.repository.user.findUserById(jwt.id, transaction);

      if (!userResult) throw new ErrorService(404, "User not found");

      const [jwtResult, refreshToken] = await Promise.all([generateJwt({ id: userResult.id }), generateRefreshToken({ id: userResult.id })]);
      return { jwt: jwtResult, refreshToken };
    });

    return { message: "Success", jwt: jwt, refreshToken };
  };
}

export default AuthService;
