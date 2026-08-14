const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Maps to public.profiles, whose id is a foreign key to Supabase's auth.users(id).
// Account creation/deletion/authentication itself is owned by Supabase Auth (see
// config/supabaseClient.js + controllers/authController.js) -- this model is only for
// reading/updating the app-specific profile fields.
const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    field: 'full_name',
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  avatarUrl: {
    type: DataTypes.STRING,
    field: 'avatar_url',
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  timeZone: {
    type: DataTypes.STRING,
    field: 'time_zone',
    defaultValue: 'UTC',
  },
  locale: {
    type: DataTypes.STRING,
    defaultValue: 'en',
  },
  onboardingState: {
    type: DataTypes.STRING,
    field: 'onboarding_state',
    defaultValue: 'new',
  },
  privacySettings: {
    type: DataTypes.JSONB,
    field: 'privacy_settings',
    allowNull: true,
  },
}, {
  tableName: 'profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Profile;
