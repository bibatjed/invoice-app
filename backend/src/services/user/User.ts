import { IUserService } from "@src/controllers/User";
import { IRepository } from "@src/repository";
import ErrorService from "@src/utils/ErrorService";
import { validateRegisterUser } from "./validate";
class UserService implements IUserService {
  constructor(private readonly repository: IRepository) {}
  async register(userDetails: { firstName: string; middleName: string; lastName: string; email: string; password: string }) {
    validateRegisterUser(userDetails);
    await this.repository.startTransaction(async (transaction) => {
      const userResult = await this.repository.user.findUserByEmail(userDetails.email, transaction);
      if (userResult) {
        throw new ErrorService(409, "User is already registered");
      }

      await this.repository.user.registerUser(userDetails, transaction);
    });

    return { message: "User is registered" };
  }
}

export default UserService;
