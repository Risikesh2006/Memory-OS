const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', videoController.getAllVideos);
router.get('/search', videoController.searchVideos);
router.get('/:id', videoController.getVideo);
router.post('/', videoController.createVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
