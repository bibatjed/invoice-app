import { IRepository } from "@src/repository";
import ErrorService from "@src/utils/ErrorService";
import { validateRegisterUser, registeUserType } from "./validate";

export interface IUserService {
  registerUser: (userDetails: registeUserType) => any;
}
class UserService implements IUserService {
  constructor(private readonly repository: IRepository) {}
  async registerUser(userDetails: registeUserType) {
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
