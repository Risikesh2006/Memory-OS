const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const controller = require('../controllers/collectionController');

router.use(authMiddleware);

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
