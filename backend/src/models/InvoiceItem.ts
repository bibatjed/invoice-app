import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, DateOnlyDataType, ForeignKey } from "sequelize";
import sequelize from "../db";
import Invoice from "./Invoice";

class InvoiceItem extends Model<InferAttributes<InvoiceItem>, InferCreationAttributes<InvoiceItem>> {
  declare id: CreationOptional<number>;
  declare invoice_id: ForeignKey<number>;
  declare item_name: string;
  declare quantity: number;
  declare price: number;
  declare total: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date>;
}

InvoiceItem.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      key: "deleted_at",
    },
  },
  { underscored: true, tableName: "invoice_item", sequelize, paranoid: true }
);

export default InvoiceItem;
