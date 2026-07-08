const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const controller = require('../controllers/aiController');

router.use(authMiddleware);

router.get('/search', controller.search);
router.post('/chat', controller.chat);
router.get('/chat/history', controller.getChatHistory);
router.get('/on-this-day', controller.onThisDay);
router.get('/insights', controller.insights);
router.get('/memories', controller.getAllMemories);
router.post('/narrative', controller.generateNarrative);

module.exports = router;
