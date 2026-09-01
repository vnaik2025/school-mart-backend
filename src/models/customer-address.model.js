import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class CustomerAddress extends Model {}

CustomerAddress.init(
  {
    ...baseAttributes,
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
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
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'CustomerAddress',
    tableName: 'customer_addresses',
    timestamps: true,
    underscored: true
  }
);
