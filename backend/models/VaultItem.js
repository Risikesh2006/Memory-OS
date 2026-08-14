const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VaultItem = sequelize.define('VaultItem', {
  vaultId: {
    type: DataTypes.UUID,
    field: 'vault_id',
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
}, {
  tableName: 'vault_items',
  timestamps: false,
});

module.exports = VaultItem;
