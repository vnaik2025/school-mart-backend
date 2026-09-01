import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class UniformSchoolMapping extends Model {}

UniformSchoolMapping.init(
  {
    ...baseAttributes,
    school_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: 'composite_school_uniform'
    },
    uniform_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: 'composite_school_uniform'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'UniformSchoolMapping',
    tableName: 'uniform_school_mappings',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['school_id', 'uniform_id']
      }
    ]
  }
);
