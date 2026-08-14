const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VaultAuditLog = sequelize.define('VaultAuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  vaultId: {
    type: DataTypes.UUID,
    field: 'vault_id',
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    allowNull: false,
  },
  eventType: {
    type: DataTypes.ENUM(
      'created', 'unlocked', 'unlock_failed', 'locked', 'item_added', 'item_removed',
      'exported', 'transferred', 'deleted'
    ),
    field: 'event_type',
    allowNull: false,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'vault_audit_log',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = VaultAuditLog;
