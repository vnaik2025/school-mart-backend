import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class Delivery extends Model {}

Delivery.init(
  {
    ...baseAttributes,
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    courier_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    tracking_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tracking_url: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    current_status: {
      type: DataTypes.ENUM('PREPARING', 'PACKED', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'),
      defaultValue: 'PREPARING',
      allowNull: false
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Delivery',
    tableName: 'deliveries',
    timestamps: true,
    underscored: true
  }
);
