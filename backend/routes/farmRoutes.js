const express = require('express');
const router = express.Router();
const { createFarm, getMyFarms, updateFarm,
  deleteFarm } = require('../controllers/farmController');
const auth = require('../middleware/auth');

router.post('/', auth, createFarm);
router.get('/', auth, getMyFarms);
router.put('/:id', auth, updateFarm);
router.delete('/:id', auth, deleteFarm);

module.exports = router;
