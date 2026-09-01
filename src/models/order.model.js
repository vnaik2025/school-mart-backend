import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class Order extends Model {}

Order.init(
  {
    ...baseAttributes,
    order_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    customer_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    school_id: {
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
      defaultValue: 'DRAFT',
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    grand_total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    total_items: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    total_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    underscored: true
  }
);
