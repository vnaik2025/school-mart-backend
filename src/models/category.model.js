import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class Category extends Model {}

Category.init(
  {
    ...baseAttributes,
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      defaultValue: 'ACTIVE',
      allowNull: false
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
    underscored: true
  }
);
