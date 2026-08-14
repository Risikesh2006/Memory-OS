const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Device = sequelize.define('Device', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    allowNull: false,
  },
  deviceName: {
    type: DataTypes.STRING,
    field: 'device_name',
    allowNull: false,
  },
  platform: {
    type: DataTypes.ENUM('android', 'ios', 'web'),
    allowNull: false,
  },
  appVersion: {
    type: DataTypes.STRING,
    field: 'app_version',
    allowNull: true,
  },
  pushToken: {
    type: DataTypes.STRING,
    field: 'push_token',
    allowNull: true,
  },
  pushProvider: {
    type: DataTypes.ENUM('fcm', 'apns'),
    field: 'push_provider',
    allowNull: true,
  },
  lastActiveAt: {
    type: DataTypes.DATE,
    field: 'last_active_at',
    allowNull: true,
  },
  notificationPermission: {
    type: DataTypes.ENUM('unknown', 'granted', 'denied'),
    field: 'notification_permission',
    defaultValue: 'unknown',
  },
  mediaPermission: {
    type: DataTypes.ENUM('unknown', 'granted', 'denied', 'limited'),
    field: 'media_permission',
    defaultValue: 'unknown',
  },
  captureSuggestionsEnabled: {
    type: DataTypes.BOOLEAN,
    field: 'capture_suggestions_enabled',
    defaultValue: false,
  },
  notificationPreferences: {
    type: DataTypes.JSONB,
    field: 'notification_preferences',
    allowNull: true,
  },
  revokedAt: {
    type: DataTypes.DATE,
    field: 'revoked_at',
    allowNull: true,
  },
}, {
  tableName: 'devices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Device;
