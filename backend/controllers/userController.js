const User = require('../models/User');
const Photo = require('../models/Photo');
const Video = require('../models/Video');
const Journal = require('../models/Journal');
const Milestone = require('../models/Milestone');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get stats
    const photos = await Photo.count({ where: { userId: req.user.id } });
    const videos = await Video.count({ where: { userId: req.user.id } });
    const journals = await Journal.count({ where: { userId: req.user.id } });
    const milestones = await Milestone.count({ where: { userId: req.user.id } });

    res.json({
      ...user.dataValues,
      totalPhotos: photos,
      totalVideos: videos,
      journalEntries: journals,
      milestones,
      totalMemories: photos + videos + journals + milestones,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { fullName, bio, profileImage } = req.body;

    if (fullName) user.fullName = fullName;
    if (bio) user.bio = bio;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      ...user.dataValues,
      password: undefined,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};
