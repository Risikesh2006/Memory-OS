const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TimeCapsule = sequelize.define('TimeCapsule', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  timeZone: {
    type: DataTypes.STRING,
    field: 'time_zone',
    defaultValue: 'UTC',
  },
  unlockAt: {
    type: DataTypes.DATE,
    field: 'unlock_at',
    allowNull: false,
  },
  recipientEmail: {
    type: DataTypes.STRING,
    field: 'recipient_email',
    allowNull: true,
  },
  recipientUserId: {
    type: DataTypes.UUID,
    field: 'recipient_user_id',
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('locked', 'ready', 'delivered', 'opened', 'cancelled'),
    defaultValue: 'locked',
  },
  deliveryState: {
    type: DataTypes.ENUM('pending', 'notified', 'failed'),
    field: 'delivery_state',
    defaultValue: 'pending',
  },
  cancellableUntil: {
    type: DataTypes.DATE,
    field: 'cancellable_until',
    allowNull: true,
  },
  openedAt: {
    type: DataTypes.DATE,
    field: 'opened_at',
    allowNull: true,
  },
}, {
  tableName: 'time_capsules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = TimeCapsule;
