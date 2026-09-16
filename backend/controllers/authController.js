const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTP, sendPasswordResetOTP } = require('../services/emailService');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP first — only create user if email succeeds
    try {
      await sendOTP(email, otp, name);
    } catch (emailError) {
      console.error('OTP send failed:', emailError.message);
      return res.status(500).json({
        msg: 'Failed to send OTP email. Please check your network and try again.'
      });
    }

    await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      isVerified: false
    });

    res.status(201).json({
      msg: 'Registered successfully. OTP sent to your email. Please verify your account.'
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) {
    return res.status(400).json({ msg: 'Invalid OTP' });
  }

  user.isVerified = true;
  user.otp = null;
  await user.save();

  res.json({ msg: 'Account verified successfully' });
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(401).json({ msg: 'Please verify OTP first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, role: user.role || 'farmer' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ msg: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('name email role');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'farmer'
      }
    });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ msg: 'If this email is registered, a password reset OTP has been sent.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendPasswordResetOTP(user.email, otp, user.name);
    } catch (emailError) {
      user.resetPasswordOtp = null;
      user.resetPasswordOtpExpires = null;
      await user.save();
      return res.status(500).json({ msg: 'Failed to send reset OTP email. Please try again.' });
    }

    return res.json({ msg: 'If this email is registered, a password reset OTP has been sent.' });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ msg: 'Email, OTP and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      !user.resetPasswordOtp ||
      user.resetPasswordOtp !== otp ||
      !user.resetPasswordOtpExpires ||
      user.resetPasswordOtpExpires.getTime() < Date.now()
    ) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    await user.save();

    return res.json({ msg: 'Password reset successful. Please login with your new password.' });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
};
