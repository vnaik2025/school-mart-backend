import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export class OrderItem extends Model {}

OrderItem.init(
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
    uniform_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    variant_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    size: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'UNISEX'),
      allowNull: false
    },
    unit_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: true,
    underscored: true
  }
);
