const nodemailer = require('nodemailer');

console.log('🔧 Email Service Loading:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'UNDEFINED');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

// Create transporter using Gmail SMTP (port 587 + STARTTLS)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  pool: true,
  maxConnections: 1,
  maxMessages: Infinity,
  rateDelta: 1000,
  rateLimit: 5
});

// Verify transporter connection on startup (non-blocking)
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email transporter ready');
  }
});

async function sendOTP(email, otp, userName) {
  try {
    console.log('📧 Sending OTP to:', email);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '🌾 AgroSense - Your OTP Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1>🌾 AgroSense</h1>
            <p style="margin: 0; font-size: 14px;">Your Farming Assistant</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to AgroSense, ${userName}!</h2>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Thank you for registering with AgroSense. To complete your account verification, please use the following One-Time Password (OTP):
            </p>
            
            <div style="background-color: #f0f0f0; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 12px;">Your Verification Code</p>
              <p style="margin: 10px 0 0 0; color: #333; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
                ${otp}
              </p>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-bottom: 20px;">
              <strong>⏱️ Note:</strong> This OTP will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
              <strong>How to use this OTP:</strong>
            </p>
            <ol style="color: #666; font-size: 14px; padding-left: 20px;">
              <li>Go to the AgroSense verification page</li>
              <li>Enter your email address</li>
              <li>Paste the OTP code above</li>
              <li>Click "Verify" to complete registration</li>
            </ol>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              © 2026 AgroSense. All rights reserved.<br>
              If you have any questions, please contact us at support@agrosense.com
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully:', info.response);
    return { success: true, message: 'OTP sent to email successfully' };
  } catch (error) {
    console.error('❌ OTP Email sending error:', error.message);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
}

async function sendPasswordResetOTP(email, otp, userName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '🌾 AgroSense - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #1e88e5 0%, #2e7d32 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1>🌾 AgroSense</h1>
            <p style="margin: 0; font-size: 14px;">Password Reset Request</p>
          </div>
          <div style="padding: 24px; background-color: white;">
            <h2 style="color: #333; margin-bottom: 16px;">Hi ${userName || 'User'},</h2>
            <p style="color: #666; font-size: 15px; margin-bottom: 14px;">
              We received a request to reset your AgroSense password. Use this OTP to continue:
            </p>
            <div style="background-color: #f0f0f0; border-left: 4px solid #1e88e5; padding: 16px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 12px;">Password Reset OTP</p>
              <p style="margin: 10px 0 0 0; color: #333; font-size: 30px; font-weight: bold; letter-spacing: 5px;">
                ${otp}
              </p>
            </div>
            <p style="color: #999; font-size: 13px; margin: 0;">
              This OTP is valid for 10 minutes. If you did not request this, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset OTP email sent:', info.response);
    return { success: true };
  } catch (error) {
    console.error('❌ Password reset OTP email error:', error.message);
    throw new Error(`Failed to send password reset OTP email: ${error.message}`);
  }
}

async function sendAIReport(email, pdfBuffer, farmData, statistics) {
  try {
    console.log('📧 Preparing to send enhanced email to:', email);
    
    // Format statistics for email display
    const statsHTML = statistics ? `
      <h3>📊 Key Statistics:</h3>
      <ul>
        <li><strong>Risk Score:</strong> ${statistics.recommendation?.riskScore || 0}/100 (${statistics.recommendation?.riskLevel || 'N/A'})</li>
        <li><strong>Environmental Score:</strong> ${statistics.environmentalScore || 0}/100</li>
        <li><strong>Soil Health:</strong> ${statistics.soilHealthScore || 0}/100</li>
        <li><strong>Confidence Level:</strong> ${statistics.confidenceScore || 0}%</li>
        <li><strong>Predicted Yield:</strong> ${statistics.yieldAnalysis?.predicted || 0} ${statistics.yieldAnalysis?.unit || 'units'}</li>
      </ul>
    ` : '';

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '🌾 Your AgroSense AI Farm Recommendation Report with Analytics',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 32px;">🌾 AgroSense</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">AI-Powered Farm Analytics Report</p>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <h2 style="color: #333; margin-bottom: 10px;">Your Personalized Farm Recommendation</h2>
            <p style="color: #666; margin-bottom: 20px;">Report generated on ${new Date().toLocaleDateString()}</p>
            
            <h3 style="border-bottom: 2px solid #667eea; padding-bottom: 10px; color: #333;">📋 Farm Overview</h3>
            <div style="margin: 15px 0; line-height: 1.8;">
              <p><strong>🌾 Crop:</strong> ${farmData.farm.crop}</p>
              <p><strong>🌱 Soil Type:</strong> ${farmData.farm.soilType}</p>
              <p><strong>📏 Area:</strong> ${farmData.farm.area} acres</p>
            </div>

            <h3 style="border-bottom: 2px solid #667eea; padding-bottom: 10px; color: #333; margin-top: 20px;">🌦️ Current Weather</h3>
            <div style="margin: 15px 0; line-height: 1.8;">
              <p><strong>🌡️ Temperature:</strong> ${farmData.weather.temperature}°C</p>
              <p><strong>💧 Humidity:</strong> ${farmData.weather.humidity}%</p>
              ${farmData.weather.rainfall ? `<p><strong>🌧️ Rainfall:</strong> ${farmData.weather.rainfall}mm</p>` : ''}
              ${farmData.weather.windSpeed ? `<p><strong>💨 Wind Speed:</strong> ${farmData.weather.windSpeed} km/h</p>` : ''}
            </div>

            <h3 style="border-bottom: 2px solid #667eea; padding-bottom: 10px; color: #333; margin-top: 20px;">💡 AI Recommendations</h3>
            <div style="background-color: #f0f8ff; border-left: 4px solid #667eea; padding: 15px; margin: 15px 0;">
              <p><strong>🧪 Fertilizer:</strong> ${farmData.recommendation.fertilizer}</p>
              <p><strong>⚖️ Quantity:</strong> ${farmData.recommendation.quantity}</p>
              <p><strong>💧 Irrigation:</strong> ${farmData.recommendation.irrigation}</p>
            </div>

            ${statistics ? `
            <h3 style="border-bottom: 2px solid #667eea; padding-bottom: 10px; color: #333; margin-top: 20px;">📊 Advanced Analytics</h3>
            <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 5px;">
              <p><strong>⚠️ Risk Assessment:</strong></p>
              <div style="margin: 10px 0; padding: 10px; background-color: white; border-radius: 3px;">
                <p style="margin: 5px 0;"><strong>Risk Level:</strong> ${statistics.recommendation?.riskLevel || 'N/A'} (Score: ${statistics.recommendation?.riskScore || 0}/100)</p>
                <p style="margin: 5px 0;"><strong>Environmental Score:</strong> ${statistics.environmentalScore || 0}/100</p>
                <p style="margin: 5px 0;"><strong>Soil Health Score:</strong> ${statistics.soilHealthScore || 0}/100</p>
                <p style="margin: 5px 0;"><strong>Recommendation Confidence:</strong> ${statistics.confidenceScore || 0}%</p>
              </div>

              <p style="margin-top: 15px;"><strong>📈 Yield Analysis:</strong></p>
              <div style="margin: 10px 0; padding: 10px; background-color: white; border-radius: 3px;">
                <p style="margin: 5px 0;"><strong>Predicted Yield:</strong> ${statistics.yieldAnalysis?.predicted || 0} ${statistics.yieldAnalysis?.unit || 'units'}</p>
                <p style="margin: 5px 0;"><strong>Benchmark Yield:</strong> ${statistics.yieldAnalysis?.benchmark || 0} ${statistics.yieldAnalysis?.unit || 'units'}</p>
                <p style="margin: 5px 0;"><strong>Production Efficiency:</strong> ${statistics.yieldAnalysis?.efficiency || 0}%</p>
              </div>

              <p style="margin-top: 15px;"><strong>🌱 Resource Management:</strong></p>
              <div style="margin: 10px 0; padding: 10px; background-color: white; border-radius: 3px;">
                <p style="margin: 5px 0;"><strong>Fertilizer per Acre:</strong> ${statistics.fertilizerAnalysis?.perAcre || 0} kg/acre</p>
                <p style="margin: 5px 0;"><strong>Irrigation Schedule:</strong> ${statistics.irrigationAnalysis?.frequency || 'As recommended'}</p>
                <p style="margin: 5px 0;"><strong>Estimated Water Needs:</strong> ${statistics.irrigationAnalysis?.estimatedWaterNeeds || 0} liters/irrigation</p>
              </div>
            </div>
            ` : ''}

            <h3 style="border-bottom: 2px solid #667eea; padding-bottom: 10px; color: #333; margin-top: 20px;">✅ Recommended Actions</h3>
            ${farmData.recommendation.advice && farmData.recommendation.advice.length > 0 ? `
              <ol style="color: #666; margin: 15px 0; line-height: 1.8;">
                ${farmData.recommendation.advice.slice(0, 5).map(a => `<li>${a}</li>`).join('')}
              </ol>
            ` : ''}

            ${farmData.recommendation.risk && farmData.recommendation.risk.length > 0 ? `
            <h3 style="border-bottom: 2px solid #ff6b6b; padding-bottom: 10px; color: #d32f2f; margin-top: 20px;">⚠️ Risk Alerts</h3>
            <ul style="color: #666; margin: 15px 0; line-height: 1.8;">
              ${farmData.recommendation.risk.slice(0, 5).map(r => `<li style="color: #d32f2f;"><strong>${r}</strong></li>`).join('')}
            </ul>
            ` : ''}

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
              <strong>📎 Attached Report:</strong> A comprehensive PDF report with detailed charts and visualizations has been attached.
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              © 2026 AgroSense. All rights reserved.<br>
              <a href="mailto:support@agrosense.com" style="color: #667eea; text-decoration: none;">support@agrosense.com</a>
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `AgroSense_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Enhanced email sent successfully:', info.response);
    return { success: true, message: 'Enhanced report email sent successfully' };
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

module.exports = { sendOTP, sendAIReport, sendPasswordResetOTP };
