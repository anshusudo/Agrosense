require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: node scripts/makeAdmin.js <email>');
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User not found: ${email}`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`Success: ${email} is now an admin.`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to promote admin:', err.message);
    process.exit(1);
  }
}

run();
