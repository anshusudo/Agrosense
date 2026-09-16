const Farm = require('../models/Farm');

exports.createFarm = async (req, res) => {
  try {
    const { crop, soilType, city, area } = req.body;

    if (!city || !String(city).trim()) {
      return res.status(400).json({ msg: 'City is required for weather-based recommendations' });
    }

    const farm = await Farm.create({
      crop,
      soilType,
      city: String(city).trim(),
      area,
      owner: req.user.userId // from JWT
    });

    res.status(201).json(farm);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true }
    );

    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    res.json(farm);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    res.json({ msg: 'Farm deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMyFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ owner: req.user.userId });
    res.json(farms);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
