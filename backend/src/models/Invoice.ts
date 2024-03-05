import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, DateOnlyDataType, ForeignKey, NonAttribute, Association } from "sequelize";
import sequelize from "../db";
import InvoiceItem from "./InvoiceItem";
import User from "./User";

class Invoice extends Model<InferAttributes<Invoice, { omit: "invoice_items" }>, InferCreationAttributes<Invoice>> {
  declare id: CreationOptional<number>;
  declare user_id: ForeignKey<number>;
  declare invoice_tag: string;
  declare bill_from_street_address: string;
  declare bill_from_city: string;
  declare bill_from_post_code: string;
  declare bill_from_country: string;
  declare bill_to_client_name: string;
  declare bill_to_client_email: string;
  declare bill_to_street_address: string;
  declare bill_to_city: string;
  declare bill_to_post_code: string;
  declare bill_to_country: string;
  declare invoice_date: DateOnlyDataType;
  declare payment_terms: string;
  declare project_description: string;
  declare status: string;
  declare total: number;
  declare invoice_items: NonAttribute<InvoiceItem>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date>;

  declare static associations: {
    invoice_items: Association<Invoice, InvoiceItem>;
  };
}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    invoice_tag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    bill_from_street_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bill_from_city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bill_from_post_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bill_from_country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bill_to_client_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bill_to_client_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bill_to_street_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bill_to_city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bill_to_post_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bill_to_country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    payment_terms: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { underscored: true, deletedAt: "deleted_at", updatedAt: "updated_at", createdAt: "created_at", tableName: "invoice", sequelize, paranoid: true }
);
Invoice.hasMany(InvoiceItem, {
  sourceKey: "id",
  foreignKey: "invoice_id",
  as: "invoice_items",
});
InvoiceItem.belongsTo(Invoice, {
  foreignKey: {
    name: "invoice_id",
    field: "invoice_id",
  },
});

export default Invoice;
