const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Milestone model — represents a single tracked life event owned by a user.
 */
const Milestone = sequelize.define('Milestone', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('Education', 'Career', 'Personal', 'Travel', 'Achievement'),
    defaultValue: 'Achievement',
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
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at',
    allowNull: true,
  },
}, {
  tableName: 'milestones',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Milestone;
