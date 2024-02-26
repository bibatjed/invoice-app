import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, NonAttribute, Association } from "sequelize";
import sequelize from "../db";
import { comparePassword, hashPassword } from "@src/utils/hashpassword";
import Invoice from "./Invoice";

class User extends Model<InferAttributes<User, { omit: "invoices" }>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare first_name: string;
  declare middle_name?: string;
  declare last_name: string;
  declare email: string;
  declare password: string;
  declare invoices?: NonAttribute<Invoice>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date>;

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
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
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
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { underscored: true, tableName: "users", sequelize, paranoid: true }
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
