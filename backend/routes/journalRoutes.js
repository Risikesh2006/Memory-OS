const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', journalController.getAllJournals);
router.get('/search', journalController.searchJournals);
router.get('/:id', journalController.getJournal);
router.post('/', journalController.createJournal);
router.put('/:id', journalController.updateJournal);
router.delete('/:id', journalController.deleteJournal);

module.exports = router;
