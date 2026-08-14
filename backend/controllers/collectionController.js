const Collection = require('../models/Collection');
const CollectionItem = require('../models/CollectionItem');

async function withItems(collection) {
  const items = await CollectionItem.findAll({
    where: { collectionId: collection.id },
    order: [['sortOrder', 'ASC']],
  });
  return {
    ...collection.toJSON(),
    items: items.map((i) => ({ memoryType: i.memoryType, memoryId: i.memoryId })),
  };
}

// POST /api/collections  { name, description, coverImage, items?: [{memoryType, memoryId}] }
exports.create = async (req, res) => {
  try {
    const { name, description, coverImage, items } = req.body;
    if (!name) return res.status(400).json({ message: 'Collection name is required' });

    const collection = await Collection.create({
      userId: req.user.id,
      name,
      description,
      coverImage,
    });

    if (Array.isArray(items) && items.length) {
      await CollectionItem.bulkCreate(
        items
          .filter((i) => i.memoryType && i.memoryId)
          .map((i, index) => ({
            collectionId: collection.id,
            userId: req.user.id,
            memoryType: i.memoryType,
            memoryId: i.memoryId,
            sortOrder: index,
          }))
      );
    }

    res.status(201).json(await withItems(collection));
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
    res.json(await Promise.all(collections.map(withItems)));
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
    res.json(await withItems(collection));
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

    const { name, description, coverImage, sortOrder, visibility } = req.body;
    await collection.update({ name, description, coverImage, sortOrder, visibility });
    res.json(await withItems(collection));
  } catch (error) {
    res.status(500).json({ message: 'Failed to update collection', error: error.message });
  }
};

// POST /api/collections/:id/items  { memoryType, memoryId }
exports.addItem = async (req, res) => {
  try {
    const collection = await Collection.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });

    const { memoryType, memoryId } = req.body;
    if (!memoryType || !memoryId) return res.status(400).json({ message: 'memoryType and memoryId are required' });

    await CollectionItem.findOrCreate({
      where: { collectionId: collection.id, memoryType, memoryId },
      defaults: { userId: req.user.id },
    });

    res.status(201).json(await withItems(collection));
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item', error: error.message });
  }
};

// DELETE /api/collections/:id/items/:memoryType/:memoryId
exports.removeItem = async (req, res) => {
  try {
    const collection = await Collection.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });

    await CollectionItem.destroy({
      where: {
        collectionId: collection.id,
        memoryType: req.params.memoryType,
        memoryId: req.params.memoryId,
      },
    });

    res.json(await withItems(collection));
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item', error: error.message });
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
