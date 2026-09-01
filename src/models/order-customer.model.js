import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Immutable snapshot — no soft-delete, no updated_at needed beyond timestamps
export class OrderCustomer extends Model {}

OrderCustomer.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'OrderCustomer',
    tableName: 'order_customers',
    timestamps: true,
    underscored: true,
    updatedAt: false
  }
);
