const Photo = require('../models/Photo');
const { v4: uuidv4 } = require('uuid');

// Get all photos
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll({ where: { userId: req.user.id } });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch photos', error: error.message });
  }
};

// Get single photo
exports.getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    if (photo.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch photo', error: error.message });
  }
};

// Create photo
exports.createPhoto = async (req, res) => {
  try {
    const { title, description, url, cloudinaryId } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    const photo = await Photo.create({
      id: uuidv4(),
      userId: req.user.id,
      title,
      description,
      url,
      cloudinaryId,
    });

    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create photo', error: error.message });
  }
};

// Delete photo
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    if (photo.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await photo.destroy();
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete photo', error: error.message });
  }
};

// Search photos
exports.searchPhotos = async (req, res) => {
  try {
    const { q } = req.query;
    const photos = await Photo.findAll({
      where: {
        userId: req.user.id,
        title: { [require('sequelize').Op.like]: `%${q}%` },
      },
    });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};
