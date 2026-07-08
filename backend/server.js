const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const videoRoutes = require('./routes/videoRoutes');
const journalRoutes = require('./routes/journalRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const userRoutes = require('./routes/userRoutes');
const timelineRoutes = require('./routes/timelineRoutes');
const aiRoutes = require('./routes/aiRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const timeCapsuleRoutes = require('./routes/timeCapsuleRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.API_PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/users', userRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/capsules', timeCapsuleRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync({ alter: false });
    console.log('✅ Database synced');

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Make sure MySQL is running and .env is configured correctly.');
    process.exit(1);
  }
};

startServer();
