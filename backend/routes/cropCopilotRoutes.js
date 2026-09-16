const express = require('express');
const auth = require('../middleware/auth');
const uploadCropImage = require('../middleware/uploadCropImage');
const { analyzeCropImage } = require('../controllers/cropCopilotController');

const router = express.Router();

router.post('/analyze', auth, (req, res, next) => {
  uploadCropImage.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message || 'Invalid crop image upload.' });
    }

    return analyzeCropImage(req, res, next);
  });
});

module.exports = router;