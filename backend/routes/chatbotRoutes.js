const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { chatbotHealth, askChatbot } = require('../controllers/chatbotController');

router.get('/health', auth, chatbotHealth);
router.post('/ask', auth, askChatbot);

module.exports = router;
