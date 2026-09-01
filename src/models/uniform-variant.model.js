import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class UniformVariant extends Model {}

UniformVariant.init(
  {
    ...baseAttributes,
    uniform_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    size: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'UNISEX'),
      defaultValue: 'UNISEX',
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    quantity_requirement: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
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
    modelName: 'UniformVariant',
    tableName: 'uniform_variants',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['uniform_id', 'size', 'gender']
      }
    ]
  }
);
