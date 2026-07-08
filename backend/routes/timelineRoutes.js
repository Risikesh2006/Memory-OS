const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');
const Video = require('../models/Video');
const Journal = require('../models/Journal');
const Milestone = require('../models/Milestone');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Get all timeline events
router.get('/', async (req, res) => {
  try {
    const photos = await Photo.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'title', 'url', 'createdAt'],
      raw: true,
    });

    const videos = await Video.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'title', 'thumbnailUrl', 'createdAt'],
      raw: true,
    });

    const journals = await Journal.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'title', 'createdAt'],
      raw: true,
    });

    const milestones = await Milestone.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'title', 'date'],
      raw: true,
    });

    const timeline = [
      ...photos.map(p => ({ ...p, type: 'photo', date: p.createdAt })),
      ...videos.map(v => ({ ...v, type: 'video', date: v.createdAt })),
      ...journals.map(j => ({ ...j, type: 'journal', date: j.createdAt })),
      ...milestones.map(m => ({ ...m, type: 'milestone', date: m.date })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch timeline', error: error.message });
  }
});

// Get timeline by year
router.get('/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const photos = await Photo.findAll({
      where: {
        userId: req.user.id,
        createdAt: { [require('sequelize').Op.between]: [startDate, endDate] },
      },
      attributes: ['id', 'title', 'url', 'createdAt'],
      raw: true,
    });

    const videos = await Video.findAll({
      where: {
        userId: req.user.id,
        createdAt: { [require('sequelize').Op.between]: [startDate, endDate] },
      },
      attributes: ['id', 'title', 'thumbnailUrl', 'createdAt'],
      raw: true,
    });

    const journals = await Journal.findAll({
      where: {
        userId: req.user.id,
        createdAt: { [require('sequelize').Op.between]: [startDate, endDate] },
      },
      attributes: ['id', 'title', 'createdAt'],
      raw: true,
    });

    const milestones = await Milestone.findAll({
      where: {
        userId: req.user.id,
        date: { [require('sequelize').Op.between]: [startDate, endDate] },
      },
      attributes: ['id', 'title', 'date'],
      raw: true,
    });

    const timeline = [
      ...photos.map(p => ({ ...p, type: 'photo', date: p.createdAt })),
      ...videos.map(v => ({ ...v, type: 'video', date: v.createdAt })),
      ...journals.map(j => ({ ...j, type: 'journal', date: j.createdAt })),
      ...milestones.map(m => ({ ...m, type: 'milestone', date: m.date })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch timeline', error: error.message });
  }
});

module.exports = router;
