const User = require('../models/User');
const Farm = require('../models/Farm');

exports.getOverview = async (req, res) => {
  try {
    const [totalUsers, totalFarms, verifiedUsers] = await Promise.all([
      User.countDocuments(),
      Farm.countDocuments(),
      User.countDocuments({ isVerified: true })
    ]);

    return res.json({
      totalUsers,
      totalFarms,
      verifiedUsers,
      unverifiedUsers: Math.max(totalUsers - verifiedUsers, 0)
    });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to load admin overview' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email isVerified role createdAt')
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to load users' });
  }
};

exports.getFarms = async (req, res) => {
  try {
    const farms = await Farm.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    return res.json(farms);
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to load farms' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['farmer', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.role = role;
    await user.save();

    return res.json({ msg: 'User role updated successfully' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to update user role' });
  }
};

exports.deleteFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await Farm.findByIdAndDelete(id);

    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    return res.json({ msg: 'Farm deleted successfully' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to delete farm' });
  }
};
