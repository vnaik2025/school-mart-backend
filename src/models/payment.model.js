import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class Payment extends Model {}

Payment.init(
  {
    ...baseAttributes,
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    payment_method: {
      type: DataTypes.ENUM('SIMULATED', 'RAZORPAY', 'STRIPE', 'UPI', 'COD'),
      defaultValue: 'SIMULATED',
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'),
      defaultValue: 'PENDING',
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    gateway_reference: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    timestamps: true,
    underscored: true
  }
);
