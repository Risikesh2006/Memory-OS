const { Op } = require('sequelize');
const TimeCapsule = require('../models/TimeCapsule');
const TimeCapsuleItem = require('../models/TimeCapsuleItem');

// Unlock enforcement lives here, server-side, keyed off `unlockAt` -- never trust a client-sent
// "isLocked" flag. Any capsule whose unlock time has passed transitions locked -> ready before
// it is ever returned to the client.
async function releaseDueCapsules(userId) {
  await TimeCapsule.update(
    { status: 'ready' },
    { where: { userId, status: 'locked', unlockAt: { [Op.lte]: new Date() } } }
  );
}

function serialize(capsule, items) {
  const json = capsule.toJSON();
  const isOpenable = ['ready', 'delivered', 'opened'].includes(json.status);
  if (!isOpenable) {
    json.message = null;
    json.items = [];
  } else {
    json.items = items || [];
  }
  const diffMs = new Date(json.unlockAt) - new Date();
  json.daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  return json;
}

// POST /api/capsules  { title, message, timeZone, unlockAt, recipientEmail?, items?: [{memoryType, memoryId}] }
exports.create = async (req, res) => {
  try {
    const { title, message, timeZone, unlockAt, recipientEmail, items } = req.body;

    if (!title || !unlockAt) {
      return res.status(400).json({ message: 'Title and unlockAt are required' });
    }
    if (new Date(unlockAt) <= new Date()) {
      return res.status(400).json({ message: 'unlockAt must be in the future' });
    }

    const capsule = await TimeCapsule.create({
      userId: req.user.id,
      title,
      message,
      timeZone: timeZone || 'UTC',
      unlockAt,
      recipientEmail: recipientEmail || null,
      status: 'locked',
      cancellableUntil: unlockAt,
    });

    if (Array.isArray(items) && items.length) {
      await TimeCapsuleItem.bulkCreate(
        items
          .filter((i) => i.memoryType && i.memoryId)
          .map((i) => ({
            capsuleId: capsule.id,
            userId: req.user.id,
            memoryType: i.memoryType,
            memoryId: i.memoryId,
          }))
      );
    }

    res.status(201).json(serialize(capsule, items || []));
  } catch (error) {
    res.status(500).json({ message: 'Failed to create time capsule', error: error.message });
  }
};

// GET /api/capsules
exports.getAll = async (req, res) => {
  try {
    await releaseDueCapsules(req.user.id);

    const capsules = await TimeCapsule.findAll({
      where: { userId: req.user.id },
      order: [['unlockAt', 'ASC']],
    });

    const itemsByCapsule = await TimeCapsuleItem.findAll({ where: { userId: req.user.id } });
    const grouped = itemsByCapsule.reduce((acc, item) => {
      (acc[item.capsuleId] ||= []).push({ memoryType: item.memoryType, memoryId: item.memoryId });
      return acc;
    }, {});

    res.json(capsules.map((c) => serialize(c, grouped[c.id] || [])));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch capsules', error: error.message });
  }
};

// GET /api/capsules/:id
exports.getOne = async (req, res) => {
  try {
    await releaseDueCapsules(req.user.id);

    const capsule = await TimeCapsule.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!capsule) return res.status(404).json({ message: 'Capsule not found' });

    const items = await TimeCapsuleItem.findAll({ where: { capsuleId: capsule.id, userId: req.user.id } });
    res.json(serialize(capsule, items.map((i) => ({ memoryType: i.memoryType, memoryId: i.memoryId }))));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch capsule', error: error.message });
  }
};

// POST /api/capsules/:id/open -- marks a ready/delivered capsule as opened. Fails on a still-
// locked capsule regardless of what the client believes its state is.
exports.open = async (req, res) => {
  try {
    const capsule = await TimeCapsule.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!capsule) return res.status(404).json({ message: 'Capsule not found' });

    if (capsule.status === 'locked' && new Date(capsule.unlockAt) > new Date()) {
      return res.status(403).json({ message: 'This capsule is not unlockable yet' });
    }

    capsule.status = 'opened';
    capsule.openedAt = new Date();
    await capsule.save();

    const items = await TimeCapsuleItem.findAll({ where: { capsuleId: capsule.id, userId: req.user.id } });
    res.json(serialize(capsule, items.map((i) => ({ memoryType: i.memoryType, memoryId: i.memoryId }))));
  } catch (error) {
    res.status(500).json({ message: 'Failed to open capsule', error: error.message });
  }
};

// DELETE /api/capsules/:id -- cancellation only permitted before the unlock time
exports.delete = async (req, res) => {
  try {
    const capsule = await TimeCapsule.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!capsule) return res.status(404).json({ message: 'Capsule not found' });

    if (capsule.status !== 'locked') {
      return res.status(400).json({ message: 'Only a still-locked capsule can be cancelled' });
    }

    await capsule.destroy();
    res.json({ message: 'Capsule cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete capsule', error: error.message });
  }
};
