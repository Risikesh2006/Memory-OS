const { Sequelize } = require('sequelize');
require('dotenv').config();

// Content tables (photos/videos/journals/milestones/collections/etc.) are still queried
// through Sequelize, but the database itself is now the Supabase-hosted Postgres instance.
// Auth (users, sessions, OTP) is owned entirely by Supabase Auth -- see config/supabaseClient.js
// -- this connection is only for `public.*` tables.
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: process.env.DATABASE_SSL === 'false' ? {} : {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

module.exports = sequelize;
