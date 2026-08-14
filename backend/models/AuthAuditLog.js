const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuthAuditLog = sequelize.define('AuthAuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  eventType: {
    type: DataTypes.STRING,
    field: 'event_type',
    allowNull: false,
  },
  ipAddress: {
    type: DataTypes.STRING,
    field: 'ip_address',
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.STRING,
    field: 'user_agent',
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'auth_audit_log',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = AuthAuditLog;
