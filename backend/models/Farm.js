const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true },
    soilType: { type: String, required: true },
    city: { type: String, required: true, trim: true },
    area: { type: Number, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farm', farmSchema);
