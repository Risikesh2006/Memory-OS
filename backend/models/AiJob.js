const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AiJob = sequelize.define('AiJob', {
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
  jobType: {
    type: DataTypes.STRING,
    field: 'job_type',
    allowNull: false,
  },
  targetType: {
    type: DataTypes.STRING,
    field: 'target_type',
    allowNull: true,
  },
  targetId: {
    type: DataTypes.UUID,
    field: 'target_id',
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('queued', 'running', 'succeeded', 'failed', 'cancelled'),
    defaultValue: 'queued',
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  attemptCount: {
    type: DataTypes.INTEGER,
    field: 'attempt_count',
    defaultValue: 0,
  },
  maxAttempts: {
    type: DataTypes.INTEGER,
    field: 'max_attempts',
    defaultValue: 5,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  promptVersion: {
    type: DataTypes.STRING,
    field: 'prompt_version',
    allowNull: true,
  },
  inputVersion: {
    type: DataTypes.STRING,
    field: 'input_version',
    allowNull: true,
  },
  output: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  errorCode: {
    type: DataTypes.STRING,
    field: 'error_code',
    allowNull: true,
  },
  errorMessage: {
    type: DataTypes.TEXT,
    field: 'error_message',
    allowNull: true,
  },
  idempotencyKey: {
    type: DataTypes.STRING,
    field: 'idempotency_key',
    allowNull: true,
  },
  startedAt: {
    type: DataTypes.DATE,
    field: 'started_at',
    allowNull: true,
  },
  completedAt: {
    type: DataTypes.DATE,
    field: 'completed_at',
    allowNull: true,
  },
}, {
  tableName: 'ai_jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = AiJob;
