const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    const user = await User.findById(req.user.userId).select('role');
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    req.user.role = 'admin';
    next();
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = admin;
