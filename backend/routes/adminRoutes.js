const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  getOverview,
  getUsers,
  getFarms,
  updateUserRole,
  deleteFarm
} = require('../controllers/adminController');

router.use(auth, admin);

router.get('/overview', getOverview);
router.get('/users', getUsers);
router.get('/farms', getFarms);
router.patch('/users/:id/role', updateUserRole);
router.delete('/farms/:id', deleteFarm);

module.exports = router;
