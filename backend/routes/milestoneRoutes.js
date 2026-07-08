const express = require('express');
const router = express.Router();
const milestoneController = require('../controllers/milestoneController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', milestoneController.getAllMilestones);
router.get('/:id', milestoneController.getMilestone);
router.post('/', milestoneController.createMilestone);
router.put('/:id', milestoneController.updateMilestone);
router.delete('/:id', milestoneController.deleteMilestone);

module.exports = router;
