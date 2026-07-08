const Video = require('../models/Video');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({ where: { userId: req.user.id } });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch videos', error: error.message });
  }
};

// Get single video
exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch video', error: error.message });
  }
};

// Create video
exports.createVideo = async (req, res) => {
  try {
    const { title, description, url, thumbnailUrl, cloudinaryId, duration } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    const video = await Video.create({
      id: uuidv4(),
      userId: req.user.id,
      title,
      description,
      url,
      thumbnailUrl,
      cloudinaryId,
      duration,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create video', error: error.message });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await video.destroy();
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete video', error: error.message });
  }
};

// Search videos
exports.searchVideos = async (req, res) => {
  try {
    const { q } = req.query;
    const videos = await Video.findAll({
      where: {
        userId: req.user.id,
        title: { [Op.like]: `%${q}%` },
      },
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};
