import { Transaction } from "sequelize";
import UserRepository, { IUserRepository } from "./User";
import sequelize from "../db";
import InvoiceRepository, { IInvoiceRepositry } from "./Invoice";

export interface IRepository {
  startTransaction: typeof startTransaction;
  user: IUserRepository;
  invoice: IInvoiceRepositry;
}
function startTransaction<T>(callback: (t: Transaction) => Promise<T>) {
  return sequelize.transaction(callback);
}

export default function initializeRepository() {
  const repository: IRepository = {
    startTransaction: startTransaction,
    user: new UserRepository(),
    invoice: new InvoiceRepository(),
  };

  return repository;
}
