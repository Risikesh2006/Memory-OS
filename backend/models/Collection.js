const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Collection = sequelize.define('Collection', {
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
    allowNull: true,
  },
  memoryIds: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  memoryType: {
    type: DataTypes.STRING,
    defaultValue: 'mixed',
  },
}, {
  timestamps: true,
});

Collection.belongsTo(User, { foreignKey: 'userId' });

module.exports = Collection;
