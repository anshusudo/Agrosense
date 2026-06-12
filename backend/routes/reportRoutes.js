const express = require('express');
const router = express.Router();
const { sendAIReport } = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.get('/send/:id', auth, sendAIReport);

module.exports = router;
