import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class Cart extends Model {}

Cart.init(
  {
    ...baseAttributes,
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    school_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'CHECKED_OUT', 'ABANDONED'),
      defaultValue: 'ACTIVE',
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true,
    underscored: true
  }
);
