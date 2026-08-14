const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Journal = sequelize.define('Journal', {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  mood: {
    type: DataTypes.STRING,
    defaultValue: '😊',
  },
  eventDate: {
    type: DataTypes.DATE,
    field: 'event_date',
    allowNull: true,
  },
  isFavourite: {
    type: DataTypes.BOOLEAN,
    field: 'is_favourite',
    defaultValue: false,
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    field: 'is_archived',
    defaultValue: false,
  },
  visibility: {
    type: DataTypes.STRING,
    defaultValue: 'private',
  },
  aiStatus: {
    type: DataTypes.STRING,
    field: 'ai_status',
    defaultValue: 'pending',
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at',
    allowNull: true,
  },
}, {
  tableName: 'journals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Journal;
