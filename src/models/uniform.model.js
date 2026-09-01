import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class Uniform extends Model {}

Uniform.init(
  {
    ...baseAttributes,
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    modelName: 'Uniform',
    tableName: 'uniforms',
    timestamps: true,
    underscored: true
  }
);
