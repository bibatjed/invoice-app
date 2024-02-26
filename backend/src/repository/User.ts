import { Transaction } from "sequelize";
import User from "@src/models/User";
import { registeUserType } from "@src/services/user/validate";

type UserDetails = {} & registeUserType;
export interface IUserRepository {
  registerUser: (userDetails: UserDetails, transaction: Transaction | null) => Promise<User>;
  findUserByEmail: (email: string, transaction: Transaction | null) => Promise<User | null>;
  findUserById: (id: number, transaction?: Transaction | null) => Promise<User | null>;
}

class UserRepository implements IUserRepository {
  async registerUser(userDetails: UserDetails, transaction: Transaction | null = null) {
    userDetails.password = await User.hashPassword(userDetails.password);
    return User.create(userDetails, {
      transaction,
    });
  }

  async findUserByEmail(email: string, transaction: Transaction | null = null) {
    return User.findOne({
      where: {
        email,
      },
      transaction,
    });
  }

  async findUserById(id: number, transaction: Transaction | null = null) {
    return User.findByPk(id, {
      transaction,
    });
  }
}

export default UserRepository;
