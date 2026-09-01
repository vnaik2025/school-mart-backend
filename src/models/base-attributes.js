import { DataTypes } from 'sequelize';

export const baseAttributes = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  created_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  updated_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  is_archive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  archived_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  archived_by: {
    type: DataTypes.BIGINT,
    allowNull: true
  }
};
