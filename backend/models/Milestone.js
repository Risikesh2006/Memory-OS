const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Milestone = sequelize.define('Milestone', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
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
}, {
  timestamps: true,
});

Milestone.belongsTo(User, { foreignKey: 'userId' });

module.exports = Milestone;
