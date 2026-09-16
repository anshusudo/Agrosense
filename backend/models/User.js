const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true
    },
    password: String,
    otp: String,
    resetPasswordOtp: String,
    resetPasswordOtpExpires: Date,
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['farmer', 'admin'],
      default: 'farmer'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
