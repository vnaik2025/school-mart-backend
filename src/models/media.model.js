import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { baseAttributes } from './base-attributes.js';

export class Media extends Model {}

Media.init(
  {
    ...baseAttributes,
    entity_type: {
      type: DataTypes.ENUM('UNIFORM', 'SCHOOL', 'USER'),
      allowNull: false
    },
    entity_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    s3_key: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true
    },
    image_url: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    is_thumbnail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Media',
    tableName: 'media',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['entity_type', 'entity_id']
      }
    ]
  }
);
