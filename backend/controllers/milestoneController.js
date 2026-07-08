const Milestone = require('../models/Milestone');
const { v4: uuidv4 } = require('uuid');

// Get all milestones
exports.getAllMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.findAll(
      { where: { userId: req.user.id }, order: [['date', 'DESC']] }
    );
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch milestones', error: error.message });
  }
};

// Get single milestone
exports.getMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.id);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    if (milestone.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch milestone', error: error.message });
  }
};

// Create milestone
exports.createMilestone = async (req, res) => {
  try {
    const { title, description, date, category } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const milestone = await Milestone.create({
      id: uuidv4(),
      userId: req.user.id,
      title,
      description,
      date,
      category,
    });

    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create milestone', error: error.message });
  }
};

// Update milestone
exports.updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.id);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    if (milestone.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const { title, description, date, category } = req.body;
    if (title) milestone.title = title;
    if (description) milestone.description = description;
    if (date) milestone.date = date;
    if (category) milestone.category = category;

    await milestone.save();
    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update milestone', error: error.message });
  }
};

// Delete milestone
exports.deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.id);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    if (milestone.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await milestone.destroy();
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete milestone', error: error.message });
  }
};
