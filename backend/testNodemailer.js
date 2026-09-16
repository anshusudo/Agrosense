require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Email Configuration Check:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'NOT SET');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log('\n📧 Testing email connection...');
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Error:', error.message);
    console.log('\n⚠️  Make sure you are using Gmail App Password (16-character password without spaces)');
    console.log('📱 Generate it at: https://myaccount.google.com/apppasswords');
    process.exit(1);
  } else {
    console.log('✅ Email transporter ready!');
    process.exit(0);
  }
});
