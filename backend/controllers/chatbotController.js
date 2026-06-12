const Farm = require('../models/Farm');
const { getWeatherByCity } = require('../services/weatherService');
const { getRecommendation } = require('../services/recommendationEngine');
const { askAgroChatbot, getChatbotHealthStatus } = require('../services/chatbotService');

exports.chatbotHealth = async (req, res) => {
  const health = await getChatbotHealthStatus();
  return res.json(health);
};

exports.askChatbot = async (req, res) => {
  try {
    const { message, farmId, language } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length < 2) {
      return res.status(400).json({ msg: 'Valid message is required' });
    }

    if (message.length > 1500) {
      return res.status(400).json({ msg: 'Message is too long. Keep it under 1500 characters.' });
    }

    let farmContext = null;

    if (farmId) {
      const farm = await Farm.findOne({ _id: farmId, owner: req.user.userId });

      if (!farm) {
        return res.status(404).json({ msg: 'Farm not found' });
      }

      let weather = null;
      let recommendation = null;

      if (farm.city) {
        weather = await getWeatherByCity(farm.city);
        recommendation = getRecommendation({
          crop: farm.crop,
          soilType: farm.soilType,
          area: farm.area,
          weather
        });
      }

      farmContext = {
        farm: {
          id: farm._id,
          crop: farm.crop,
          soilType: farm.soilType,
          city: farm.city,
          area: farm.area
        },
        weather,
        recommendation: recommendation
          ? {
              fertilizer: recommendation.fertilizer,
              quantity: recommendation.quantity,
              irrigation: recommendation.irrigation,
              riskLevel: recommendation.riskLevel,
              riskScore: recommendation.riskScore,
              risk: recommendation.risk,
              diseaseRisks: recommendation.diseaseRisks,
              advice: recommendation.advice
            }
          : null
      };
    }

    const result = await askAgroChatbot({
      message: message.trim(),
      context: farmContext,
      language: ['en', 'hi', 'mr'].includes(language) ? language : 'en'
    });

    return res.json({
      reply: result.reply,
      model: result.model,
      provider: result.provider,
      contextAttached: Boolean(farmContext)
    });
  } catch (error) {
    if (error.code === 'GROQ_CONFIG_MISSING') {
      return res.status(503).json({ msg: 'Chatbot is not configured. Add GROQ_API_KEY in backend .env.' });
    }

    if (error.code === 'GROQ_INVALID_KEY') {
      return res.status(401).json({ msg: 'Invalid Groq API key. Please update GROQ_API_KEY in backend .env and restart server.' });
    }

    if (error.code === 'GROQ_RATE_LIMIT') {
      return res.status(429).json({ msg: 'Rate limit exceeded. Please try again in a moment.' });
    }

    console.error('Chatbot error:', error.message);
    return res.status(500).json({ msg: `Failed to process chatbot request: ${error.message}` });
  }
};
