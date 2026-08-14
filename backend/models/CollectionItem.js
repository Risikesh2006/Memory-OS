const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CollectionItem = sequelize.define('CollectionItem', {
  collectionId: {
    type: DataTypes.UUID,
    field: 'collection_id',
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    allowNull: false,
  },
  memoryType: {
    type: DataTypes.ENUM('photo', 'video', 'journal', 'milestone'),
    field: 'memory_type',
    primaryKey: true,
  },
  memoryId: {
    type: DataTypes.UUID,
    field: 'memory_id',
    primaryKey: true,
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    field: 'sort_order',
    defaultValue: 0,
  },
  addedAt: {
    type: DataTypes.DATE,
    field: 'added_at',
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'collection_items',
  timestamps: false,
});

module.exports = CollectionItem;
