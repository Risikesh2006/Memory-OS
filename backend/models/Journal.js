const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Journal = sequelize.define('Journal', {
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
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  mood: {
    type: DataTypes.STRING,
    defaultValue: '😊',
  },
}, {
  timestamps: true,
});

Journal.belongsTo(User, { foreignKey: 'userId' });

module.exports = Journal;
