const express = require('express');
const router = express.Router();
const { sendAIReport } = require('../services/emailService');

router.get('/email-test', async (req, res) => {
  try {
    await sendAIReport(
      'anshunagnurwar@gmail.com',
      Buffer.from('Test PDF Content')
    );
    res.json({ msg: 'Email sent successfully' });
  } catch (err) {
    console.log("EMAIL ERROR:", err);
    res.status(500).json({ msg: 'Email failed', error: err.message });
  }
});

module.exports = router;
