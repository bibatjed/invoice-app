import { Transaction } from "sequelize";
import UserRepository, { IUserRepository } from "./User";
import sequelize from "../db";

export interface IRepository {
  startTransaction: typeof startTransaction;
  user: IUserRepository;
}
function startTransaction<T>(callback: (t: Transaction) => Promise<T>) {
  return sequelize.transaction(callback);
}

export default function initializeRepository() {
  const repository: IRepository = {
    startTransaction: startTransaction,
    user: new UserRepository(),
  };

  return repository;
}
