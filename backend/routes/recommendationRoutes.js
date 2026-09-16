const express = require('express');
const router = express.Router();
const { getAIRecommendation, generateAndEmailReport, downloadReport } = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

router.get('/:id', auth, getAIRecommendation);
router.post('/:id/email-report', auth, generateAndEmailReport);
router.get('/:id/download-report', auth, downloadReport);

module.exports = router;
