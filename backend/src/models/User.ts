import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, NonAttribute, Association } from "sequelize";
import sequelize from "../db";
import { comparePassword, hashPassword } from "@src/utils/hashpassword";
import Invoice from "./Invoice";

class User extends Model<InferAttributes<User, { omit: "invoices" }>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare middleName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare invoices?: NonAttribute<Invoice>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  static hashPassword(password: string) {
    return hashPassword(password);
  }
  async comparePassword(password: string) {
    return comparePassword(password, this.password);
  }

  declare static associations: {
    invoices: Association<User, Invoice>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { tableName: "users", sequelize, paranoid: true }
);

User.hasMany(Invoice, {
  sourceKey: "id",
  foreignKey: "user_id",
  as: "invoice",
});

Invoice.belongsTo(User, {
  foreignKey: {
    name: "user_id",
    field: "user_id",
  },
});

export default User;
