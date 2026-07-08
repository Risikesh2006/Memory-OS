const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const ChatHistory = sequelize.define('ChatHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  memoryRefs: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
}, {
  timestamps: true,
  updatedAt: false,
});

ChatHistory.belongsTo(User, { foreignKey: 'userId' });

module.exports = ChatHistory;
