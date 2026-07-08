const Collection = require('../models/Collection');

exports.create = async (req, res) => {
  try {
    const { name, description, coverImage, memoryIds, memoryType } = req.body;
    if (!name) return res.status(400).json({ message: 'Collection name is required' });

    const collection = await Collection.create({
      userId: req.user.id,
      name,
      description,
      coverImage,
      memoryIds: memoryIds || [],
      memoryType: memoryType || 'mixed',
    });
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create collection', error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: { userId: req.user.id },
      order: [['updatedAt', 'DESC']],
    });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch collections', error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch collection', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });

    const { name, description, coverImage, memoryIds, memoryType } = req.body;
    await collection.update({ name, description, coverImage, memoryIds, memoryType });
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update collection', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });

    await collection.destroy();
    res.json({ message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete collection', error: error.message });
  }
};
