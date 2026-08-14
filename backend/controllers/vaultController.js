const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Vault = require('../models/Vault');
const VaultItem = require('../models/VaultItem');
const VaultUnlockSession = require('../models/VaultUnlockSession');
const VaultAuditLog = require('../models/VaultAuditLog');

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const UNLOCK_SESSION_TTL_MS = 10 * 60 * 1000; // vault stays "unlocked" for 10 minutes

function logEvent(vaultId, userId, eventType, metadata = {}) {
  return VaultAuditLog.create({ vaultId, userId, eventType, metadata }).catch((err) =>
    console.error('[vault audit] failed to record event', eventType, err.message)
  );
}

// POST /api/vaults  { name, description, coverImage, yearLabel, pin }
exports.create = async (req, res) => {
  try {
    const { name, pin, description, coverImage, yearLabel } = req.body;
    if (!name || !pin) return res.status(400).json({ message: 'Name and PIN are required' });
    if (!/^\d{4,8}$/.test(pin)) return res.status(400).json({ message: 'PIN must be 4-8 digits' });

    const pinHash = await bcrypt.hash(pin, 12);
    const vault = await Vault.create({
      userId: req.user.id,
      name,
      description,
      coverImage,
      yearLabel,
      pinHash,
    });

    await logEvent(vault.id, req.user.id, 'created');

    const { pinHash: _omit, ...safe } = vault.toJSON();
    res.status(201).json(safe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create vault', error: error.message });
  }
};

// GET /api/vaults -- metadata only, never content; unlocking is a separate step
exports.getAll = async (req, res) => {
  try {
    const vaults = await Vault.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.json(vaults.map((v) => {
      const { pinHash, ...safe } = v.toJSON();
      return safe;
    }));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vaults', error: error.message });
  }
};

// POST /api/vaults/:id/unlock  { pin } -> short-lived unlock token
exports.unlock = async (req, res) => {
  try {
    const vault = await Vault.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!vault) return res.status(404).json({ message: 'Vault not found' });

    if (vault.lockedUntil && new Date(vault.lockedUntil) > new Date()) {
      return res.status(429).json({
        message: 'Too many failed attempts. Try again later.',
        retryAfterSeconds: Math.ceil((new Date(vault.lockedUntil) - new Date()) / 1000),
      });
    }

    const { pin } = req.body;
    const match = pin ? await bcrypt.compare(pin, vault.pinHash) : false;

    if (!match) {
      vault.failedAttempts += 1;
      if (vault.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        vault.lockedUntil = new Date(Date.now() + LOCKOUT_MS);
        vault.failedAttempts = 0;
      }
      await vault.save();
      await logEvent(vault.id, req.user.id, 'unlock_failed');
      return res.status(401).json({ message: 'Incorrect PIN' });
    }

    vault.failedAttempts = 0;
    vault.lockedUntil = null;
    await vault.save();

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date(Date.now() + UNLOCK_SESSION_TTL_MS);

    await VaultUnlockSession.create({ vaultId: vault.id, userId: req.user.id, tokenHash, expiresAt });
    await logEvent(vault.id, req.user.id, 'unlocked');

    res.json({ unlockToken: rawToken, expiresAt });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unlock vault', error: error.message });
  }
};

async function requireUnlockToken(req, res, vault) {
  const token = req.headers['x-vault-unlock-token'];
  if (!token) {
    res.status(403).json({ message: 'Vault unlock token required' });
    return false;
  }

  const sessions = await VaultUnlockSession.findAll({
    where: { vaultId: vault.id, userId: req.user.id },
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  const now = new Date();
  for (const session of sessions) {
    if (new Date(session.expiresAt) < now) continue;
    // eslint-disable-next-line no-await-in-loop
    if (await bcrypt.compare(token, session.tokenHash)) return true;
  }

  res.status(403).json({ message: 'Vault unlock token invalid or expired' });
  return false;
}

// GET /api/vaults/:id/items -- requires a valid x-vault-unlock-token header from /unlock
exports.getItems = async (req, res) => {
  try {
    const vault = await Vault.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!vault) return res.status(404).json({ message: 'Vault not found' });
    if (!(await requireUnlockToken(req, res, vault))) return;

    const items = await VaultItem.findAll({ where: { vaultId: vault.id } });
    res.json(items.map((i) => ({ memoryType: i.memoryType, memoryId: i.memoryId })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vault items', error: error.message });
  }
};

// POST /api/vaults/:id/items  { memoryType, memoryId } -- requires unlock token
exports.addItem = async (req, res) => {
  try {
    const vault = await Vault.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!vault) return res.status(404).json({ message: 'Vault not found' });
    if (!(await requireUnlockToken(req, res, vault))) return;

    const { memoryType, memoryId } = req.body;
    if (!memoryType || !memoryId) return res.status(400).json({ message: 'memoryType and memoryId are required' });

    await VaultItem.findOrCreate({
      where: { vaultId: vault.id, memoryType, memoryId },
      defaults: { userId: req.user.id },
    });
    await logEvent(vault.id, req.user.id, 'item_added', { memoryType, memoryId });

    res.status(201).json({ message: 'Added to vault' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item', error: error.message });
  }
};

// DELETE /api/vaults/:id/items/:memoryType/:memoryId -- requires unlock token
exports.removeItem = async (req, res) => {
  try {
    const vault = await Vault.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!vault) return res.status(404).json({ message: 'Vault not found' });
    if (!(await requireUnlockToken(req, res, vault))) return;

    await VaultItem.destroy({
      where: { vaultId: vault.id, memoryType: req.params.memoryType, memoryId: req.params.memoryId },
    });
    await logEvent(vault.id, req.user.id, 'item_removed', {
      memoryType: req.params.memoryType, memoryId: req.params.memoryId,
    });

    res.json({ message: 'Removed from vault' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item', error: error.message });
  }
};

// POST /api/vaults/:id/lock -- explicit re-lock, invalidates outstanding unlock sessions
exports.lock = async (req, res) => {
  try {
    const vault = await Vault.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!vault) return res.status(404).json({ message: 'Vault not found' });

    await VaultUnlockSession.destroy({ where: { vaultId: vault.id, userId: req.user.id } });
    await logEvent(vault.id, req.user.id, 'locked');

    res.json({ message: 'Vault locked' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to lock vault', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const vault = await Vault.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!vault) return res.status(404).json({ message: 'Vault not found' });

    await logEvent(vault.id, req.user.id, 'deleted');
    await vault.destroy();
    res.json({ message: 'Vault deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete vault', error: error.message });
  }
};
