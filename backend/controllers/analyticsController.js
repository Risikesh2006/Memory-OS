const Photo = require('../models/Photo');
const Video = require('../models/Video');
const Journal = require('../models/Journal');
const Milestone = require('../models/Milestone');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const [photoCount, videoCount, journalCount, milestoneCount] = await Promise.all([
      Photo.count({ where: { userId } }),
      Video.count({ where: { userId } }),
      Journal.count({ where: { userId } }),
      Milestone.count({ where: { userId } }),
    ]);

    // Monthly counts for chart
    const now = new Date();
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const { Op } = require('sequelize');
      const range = { [Op.between]: [start, end] };

      const [p, v, j, m] = await Promise.all([
        Photo.count({ where: { userId, createdAt: range } }),
        Video.count({ where: { userId, createdAt: range } }),
        Journal.count({ where: { userId, createdAt: range } }),
        Milestone.count({ where: { userId, createdAt: range } }),
      ]);

      monthlyData.push({
        month: start.toLocaleString('default', { month: 'short' }),
        photos: p,
        videos: v,
        journals: j,
        milestones: m,
        total: p + v + j + m,
      });
    }

    res.json({
      totals: {
        photos: photoCount,
        videos: videoCount,
        journals: journalCount,
        milestones: milestoneCount,
        total: photoCount + videoCount + journalCount + milestoneCount,
      },
      monthlyData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};
