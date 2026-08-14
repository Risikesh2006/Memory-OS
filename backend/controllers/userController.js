const Profile = require('../models/Profile');
const Photo = require('../models/Photo');
const Video = require('../models/Video');
const Journal = require('../models/Journal');
const Milestone = require('../models/Milestone');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.user.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const photos = await Photo.count({ where: { userId: req.user.id } });
    const videos = await Video.count({ where: { userId: req.user.id } });
    const journals = await Journal.count({ where: { userId: req.user.id } });
    const milestones = await Milestone.count({ where: { userId: req.user.id } });

    res.json({
      ...profile.dataValues,
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
    const profile = await Profile.findByPk(req.user.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const { fullName, bio, avatarUrl, timeZone, locale } = req.body;

    if (fullName !== undefined) profile.fullName = fullName;
    if (bio !== undefined) profile.bio = bio;
    if (avatarUrl !== undefined) profile.avatarUrl = avatarUrl;
    if (timeZone !== undefined) profile.timeZone = timeZone;
    if (locale !== undefined) profile.locale = locale;

    await profile.save();

    res.json(profile.dataValues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};
