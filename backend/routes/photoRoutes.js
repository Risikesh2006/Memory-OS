const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', photoController.getAllPhotos);
router.get('/search', photoController.searchPhotos);
router.get('/:id', photoController.getPhoto);
router.post('/', photoController.createPhoto);
router.delete('/:id', photoController.deletePhoto);

module.exports = router;
