import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Immutable history — no soft delete, no updated_at
export class DeliveryStatusHistory extends Model {}

DeliveryStatusHistory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    delivery_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PREPARING', 'PACKED', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'),
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
    modelName: 'DeliveryStatusHistory',
    tableName: 'delivery_status_history',
    timestamps: true,
    underscored: true,
    updatedAt: false
  }
);
