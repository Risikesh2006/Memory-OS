const TimeCapsule = require('../models/TimeCapsule');
const { Op } = require('sequelize');

// Create a time capsule
exports.create = async (req, res) => {
  try {
    const { title, content, type, mediaUrl, unlockDate, unlockEvent } = req.body;

    if (!title || !unlockDate) {
      return res.status(400).json({ message: 'Title and unlock date are required' });
    }

    if (new Date(unlockDate) <= new Date()) {
      return res.status(400).json({ message: 'Unlock date must be in the future' });
    }

    const capsule = await TimeCapsule.create({
      userId: req.user.id,
      title,
      content,
      type: type || 'text',
      mediaUrl,
      unlockDate,
      unlockEvent,
      isLocked: true,
    });

    res.status(201).json(capsule);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create time capsule', error: error.message });
  }
};

// Get all capsules for user
exports.getAll = async (req, res) => {
  try {
    // Auto-unlock any capsules whose date has passed
    await TimeCapsule.update(
      { isLocked: false },
      {
        where: {
          userId: req.user.id,
          isLocked: true,
          unlockDate: { [Op.lte]: new Date() },
        },
      }
    );

    const capsules = await TimeCapsule.findAll({
      where: { userId: req.user.id },
      order: [['unlockDate', 'ASC']],
    });

    // Hide content for locked capsules
    const result = capsules.map(c => {
      const capsule = c.toJSON();
      if (capsule.isLocked) {
        capsule.content = null;
        capsule.mediaUrl = null;
      }
      // Add countdown info
      const now = new Date();
      const unlock = new Date(capsule.unlockDate);
      const diff = unlock - now;
      capsule.daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      return capsule;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch capsules', error: error.message });
  }
};

// Get single capsule
exports.getOne = async (req, res) => {
  try {
    const capsule = await TimeCapsule.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    const result = capsule.toJSON();

    // Auto-unlock if date has passed
    if (result.isLocked && new Date(result.unlockDate) <= new Date()) {
      await capsule.update({ isLocked: false });
      result.isLocked = false;
    }

    if (result.isLocked) {
      result.content = null;
      result.mediaUrl = null;
    }

    const diff = new Date(result.unlockDate) - new Date();
    result.daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch capsule', error: error.message });
  }
};

// Delete capsule
exports.delete = async (req, res) => {
  try {
    const capsule = await TimeCapsule.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    await capsule.destroy();
    res.json({ message: 'Capsule deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete capsule', error: error.message });
  }
};
