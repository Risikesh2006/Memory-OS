const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const controller = require('../controllers/analyticsController');

router.use(authMiddleware);

router.get('/stats', controller.getStats);

module.exports = router;
