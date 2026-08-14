const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', deviceController.listDevices);
router.post('/', deviceController.registerDevice);
router.patch('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.revokeDevice);
router.post('/:id/heartbeat', deviceController.heartbeat);

module.exports = router;
