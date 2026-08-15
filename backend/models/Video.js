const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Video model — represents a single uploaded video owned by a user.
 */
const Video = sequelize.define('Video', {
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
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    field: 'thumbnail_url',
    allowNull: true,
  },
  cloudinaryId: {
    type: DataTypes.STRING,
    field: 'cloudinary_id',
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  eventDate: {
    type: DataTypes.DATE,
    field: 'event_date',
    allowNull: true,
  },
  captureDate: {
    type: DataTypes.DATE,
    field: 'capture_date',
    allowNull: true,
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  locationPrivacy: {
    type: DataTypes.STRING,
    field: 'location_privacy',
    defaultValue: 'private',
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
  aiStatus: {
    type: DataTypes.STRING,
    field: 'ai_status',
    defaultValue: 'pending',
  },
  sourceDeviceId: {
    type: DataTypes.UUID,
    field: 'source_device_id',
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at',
    allowNull: true,
  },
}, {
  tableName: 'videos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Video;
