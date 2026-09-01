import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class CartItem extends Model {}

CartItem.init(
  {
    ...baseAttributes,
    cart_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    variant_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['cart_id', 'variant_id']
      }
    ]
  }
);
