const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const controller = require('../controllers/vaultController');

router.use(authMiddleware);

router.post('/', controller.create);
router.get('/', controller.getAll);
router.post('/:id/unlock', controller.unlock);
router.post('/:id/lock', controller.lock);
router.get('/:id/items', controller.getItems);
router.post('/:id/items', controller.addItem);
router.delete('/:id/items/:memoryType/:memoryId', controller.removeItem);
router.delete('/:id', controller.delete);

module.exports = router;
