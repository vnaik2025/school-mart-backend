import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export class OrderAddress extends Model {}

OrderAddress.init(
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
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    address_line_1: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address_line_2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    landmark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'OrderAddress',
    tableName: 'order_addresses',
    timestamps: true,
    underscored: true,
    updatedAt: false
  }
);
