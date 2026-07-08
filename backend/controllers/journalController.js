const Journal = require('../models/Journal');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

// Get all journals
exports.getAllJournals = async (req, res) => {
  try {
    const journals = await Journal.findAll(
      { where: { userId: req.user.id }, order: [['createdAt', 'DESC']] }
    );
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch journals', error: error.message });
  }
};

// Get single journal
exports.getJournal = async (req, res) => {
  try {
    const journal = await Journal.findByPk(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    res.json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch journal', error: error.message });
  }
};

// Create journal
exports.createJournal = async (req, res) => {
  try {
    const { title, content, mood } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const journal = await Journal.create({
      id: uuidv4(),
      userId: req.user.id,
      title,
      content,
      mood,
    });

    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create journal', error: error.message });
  }
};

// Update journal
exports.updateJournal = async (req, res) => {
  try {
    const journal = await Journal.findByPk(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const { title, content, mood } = req.body;
    if (title) journal.title = title;
    if (content) journal.content = content;
    if (mood) journal.mood = mood;

    await journal.save();
    res.json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update journal', error: error.message });
  }
};

// Delete journal
exports.deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findByPk(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await journal.destroy();
    res.json({ message: 'Journal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete journal', error: error.message });
  }
};

// Search journals
exports.searchJournals = async (req, res) => {
  try {
    const { q } = req.query;
    const journals = await Journal.findAll({
      where: {
        userId: req.user.id,
        title: { [Op.like]: `%${q}%` },
      },
      order: [['createdAt', 'DESC']],
    });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};
