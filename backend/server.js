require('dotenv').config();

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please update your backend .env file and restart the server.');
  process.exit(1);
}

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const auth = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const cors = require('cors');
const recommendationRoutes = require('./routes/recommendationRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const cropCopilotRoutes = require('./routes/cropCopilotRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { sendAIReport } = require('./services/emailService');
const testEmailRoute = require('./routes/testEmail');
const reportRoutes = require('./routes/reportRoutes');
const { createRateLimiter } = require('./middleware/rateLimiter');
const crypto = require('crypto');

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

app.use((req, res, next) => {
  const incomingId = req.headers['x-request-id'];
  const requestId = typeof incomingId === 'string' && incomingId.trim()
    ? incomingId.trim()
    : crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  const start = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    console.log(JSON.stringify({
      level: 'info',
      type: 'http_request',
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs
    }));
  });

  next();
});

const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many authentication attempts. Please wait and try again.'
});

const weatherRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 40,
  message: 'Too many weather requests. Please try again in a minute.'
});

const recommendationRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 25,
  message: 'Too many recommendation requests. Please try again shortly.'
});

const chatbotRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many chatbot requests. Please try again shortly.'
});

const cropCopilotRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 12,
  message: 'Too many crop copilot requests. Please try again shortly.'
});

const adminRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 40,
  message: 'Too many admin requests. Please try again shortly.'
});

app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/weather', weatherRateLimiter, weatherRoutes);
app.use('/api/recommendations', recommendationRateLimiter, recommendationRoutes);
app.use('/api/chatbot', chatbotRateLimiter, chatbotRoutes);
app.use('/api/crop-copilot', cropCopilotRateLimiter, cropCopilotRoutes);
app.use('/api/admin', adminRateLimiter, adminRoutes);
app.use('/api/test', testEmailRoute);
app.use('/api/reports', recommendationRateLimiter, reportRoutes);

// MongoDB connection (LOCAL)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error(' MongoDB connection failed:', err.message);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/add-user', async (req, res) => {
  const user = await User.create({
    name: 'First User',
    email: 'firstuser@mail.com'
  });

  res.json(user);
});

app.get('/protected', auth, (req, res) => {
  res.json({
    msg: 'Access granted',
    user: req.user
  });
});

if (process.env.RUN_STARTUP_EMAIL_TEST === 'true') {
  setTimeout(async () => {
    try {
      const testFarmData = {
        farm: {
          crop: 'Test Crop',
          soilType: 'Test Soil',
          area: 5
        },
        weather: {
          temperature: 28,
          humidity: 65
        },
        recommendation: {
          fertilizer: 'Test Fertilizer',
          quantity: '250 kg',
          irrigation: 'Moderate irrigation'
        }
      };

      await sendAIReport(
        process.env.EMAIL_FROM,
        Buffer.from('Test PDF content'),
        testFarmData
      );
      console.log(' Startup test email sent successfully');
    } catch (err) {
      console.log(' Startup email test failed:', err.message);
    }
  }, 3000);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
