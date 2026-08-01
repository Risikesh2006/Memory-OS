/**
 * Device controller — manages the authenticated user's connected/trusted devices.
 */
const Device = require('../models/Device');

// GET /api/devices -- list the current user's connected devices
exports.listDevices = async (req, res) => {
  try {
    const devices = await Device.findAll({
      where: { userId: req.user.id, revokedAt: null },
      order: [['lastActiveAt', 'DESC']],
    });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to list devices', error: error.message });
  }
};

// POST /api/devices -- register a new device (mobile companion app onboarding)
exports.registerDevice = async (req, res) => {
  try {
    const { deviceName, platform, appVersion, pushToken, pushProvider } = req.body;
    if (!deviceName || !platform) {
      return res.status(400).json({ message: 'deviceName and platform are required' });
    }
    if (!['android', 'ios', 'web'].includes(platform)) {
      return res.status(400).json({ message: 'Invalid platform' });
    }

    const device = await Device.create({
      userId: req.user.id,
      deviceName,
      platform,
      appVersion,
      pushToken,
      pushProvider,
      lastActiveAt: new Date(),
    });

    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Failed to register device', error: error.message });
  }
};

// PATCH /api/devices/:id -- update push token, permissions, capture/notification preferences
exports.updateDevice = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device || device.userId !== req.user.id) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const {
      pushToken, pushProvider, notificationPermission, mediaPermission,
      captureSuggestionsEnabled, notificationPreferences, appVersion,
    } = req.body;

    if (pushToken !== undefined) device.pushToken = pushToken;
    if (pushProvider !== undefined) device.pushProvider = pushProvider;
    if (notificationPermission !== undefined) device.notificationPermission = notificationPermission;
    if (mediaPermission !== undefined) device.mediaPermission = mediaPermission;
    if (captureSuggestionsEnabled !== undefined) device.captureSuggestionsEnabled = captureSuggestionsEnabled;
    if (notificationPreferences !== undefined) {
      device.notificationPreferences = { ...device.notificationPreferences, ...notificationPreferences };
    }
    if (appVersion !== undefined) device.appVersion = appVersion;
    device.lastActiveAt = new Date();

    await device.save();
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update device', error: error.message });
  }
};

// DELETE /api/devices/:id -- revoke/remove a device (also invalidates its push token)
exports.revokeDevice = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device || device.userId !== req.user.id) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.revokedAt = new Date();
    device.pushToken = null;
    await device.save();

    res.json({ message: 'Device removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to revoke device', error: error.message });
  }
};

// POST /api/devices/:id/heartbeat -- lightweight liveness ping from the mobile app
exports.heartbeat = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device || device.userId !== req.user.id) {
      return res.status(404).json({ message: 'Device not found' });
    }
    device.lastActiveAt = new Date();
    await device.save();
    res.json({ message: 'ok' });
  } catch (error) {
    res.status(500).json({ message: 'Heartbeat failed', error: error.message });
  }
};
