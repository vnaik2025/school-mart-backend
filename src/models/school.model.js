import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class School extends Model {}

School.init(
  {
    ...baseAttributes,
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    logo_media_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contact_number: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
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
    modelName: 'School',
    tableName: 'schools',
    timestamps: true,
    underscored: true
  }
);
