const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Server-issued, short-lived unlock proof. The client only ever receives an opaque token;
// tokenHash stores its bcrypt hash, mirroring how the vault PIN itself is never stored raw.
const VaultUnlockSession = sequelize.define('VaultUnlockSession', {
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
  tokenHash: {
    type: DataTypes.STRING,
    field: 'token_hash',
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    field: 'expires_at',
    allowNull: false,
  },
}, {
  tableName: 'vault_unlock_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = VaultUnlockSession;
