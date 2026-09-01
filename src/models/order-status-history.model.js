import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Immutable history — no soft delete, no updated_at
export class OrderStatusHistory extends Model {}

OrderStatusHistory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'PENDING_PAYMENT',
        'CONFIRMED',
        'RECEIVED',
        'PREPARING_FOR_DISPATCH',
        'DISPATCHED',
        'DELIVERED',
        'CANCELLED'
      ),
      allowNull: false
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    changed_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'OrderStatusHistory',
    tableName: 'order_status_history',
    timestamps: true,
    underscored: true,
    updatedAt: false
  }
);
