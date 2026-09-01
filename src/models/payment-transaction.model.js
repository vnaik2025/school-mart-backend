import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Immutable audit records — no soft delete, no updated_at
export class PaymentTransaction extends Model {}

PaymentTransaction.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    payment_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    transaction_reference: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'),
      allowNull: false
    },
    gateway: {
      type: DataTypes.STRING(100),
      defaultValue: 'SIMULATED',
      allowNull: false
    },
    gateway_response: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'PaymentTransaction',
    tableName: 'payment_transactions',
    timestamps: true,
    underscored: true,
    updatedAt: false
  }
);
