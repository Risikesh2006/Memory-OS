const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const TimeCapsule = sequelize.define('TimeCapsule', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('text', 'image', 'video', 'audio'),
    defaultValue: 'text',
  },
  mediaUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  unlockDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  unlockEvent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

TimeCapsule.belongsTo(User, { foreignKey: 'userId' });

module.exports = TimeCapsule;
