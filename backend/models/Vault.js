const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// pin_hash is a bcrypt hash of the numeric PIN -- never the plaintext PIN. See
// controllers/vaultController.js for the hash/compare + rate-limiting logic.
const Vault = sequelize.define('Vault', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  coverImage: {
    type: DataTypes.STRING(500),
    field: 'cover_image',
    allowNull: true,
  },
  yearLabel: {
    type: DataTypes.STRING,
    field: 'year_label',
    allowNull: true,
  },
  pinHash: {
    type: DataTypes.STRING,
    field: 'pin_hash',
    allowNull: false,
  },
  failedAttempts: {
    type: DataTypes.INTEGER,
    field: 'failed_attempts',
    defaultValue: 0,
  },
  lockedUntil: {
    type: DataTypes.DATE,
    field: 'locked_until',
    allowNull: true,
  },
}, {
  tableName: 'vaults',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Vault;
