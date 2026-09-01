import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class CustomerProfile extends Model {}

CustomerProfile.init(
  {
    ...baseAttributes,
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    profile_media_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'CustomerProfile',
    tableName: 'customer_profiles',
    timestamps: true,
    underscored: true
  }
);
