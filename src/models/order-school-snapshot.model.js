import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export class OrderSchoolSnapshot extends Model {}

OrderSchoolSnapshot.init(
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
    school_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    school_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    contact_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'OrderSchoolSnapshot',
    tableName: 'order_school_snapshots',
    timestamps: true,
    underscored: true,
    updatedAt: false
  }
);
