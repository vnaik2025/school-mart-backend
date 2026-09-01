import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Immutable audit records — never updated, never deleted
export class AuditLog extends Model {}

AuditLog.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    entity: {
      type: DataTypes.ENUM(
        'USER', 'CUSTOMER_PROFILE', 'ADDRESS', 'SCHOOL', 'CATEGORY',
        'UNIFORM', 'VARIANT', 'MEDIA', 'SCHOOL_MAPPING',
        'CART', 'CART_ITEM', 'ORDER', 'PAYMENT', 'DELIVERY'
      ),
      allowNull: false
    },
    entity_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    request_method: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    request_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    request_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'AuditLog',
    tableName: 'audit_logs',
    timestamps: true,
    underscored: true,
    updatedAt: false
  }
);
