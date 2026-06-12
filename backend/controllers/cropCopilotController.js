const Farm = require('../models/Farm');
const { getWeatherByCity } = require('../services/weatherService');
const { getRecommendation } = require('../services/recommendationEngine');
const { analyzeCropImage } = require('../services/cropCopilotService');

const buildFarmContext = async (farm) => {
  let weather = null;
  let recommendation = null;

  if (farm.city) {
    try {
      weather = await getWeatherByCity(farm.city);

      if (weather) {
        recommendation = getRecommendation({
          crop: farm.crop,
          soilType: farm.soilType,
          area: farm.area,
          weather
        });
      }
    } catch (error) {
      console.warn('Crop copilot farm context unavailable:', error.message);
    }
  }

  return {
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
};

exports.analyzeCropImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a crop image.' });
    }

    const { farmId, cropType, notes } = req.body;
    let farmContext = null;
    let selectedCropType = cropType || '';

    if (farmId) {
      const farm = await Farm.findOne({ _id: farmId, owner: req.user.userId });

      if (!farm) {
        return res.status(404).json({ msg: 'Farm not found' });
      }

      farmContext = await buildFarmContext(farm);
      selectedCropType = selectedCropType || farm.crop || '';
    }

    const analysis = await analyzeCropImage({
      imageBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
      cropType: selectedCropType,
      notes,
      farmContext
    });

    return res.json({
      ...analysis,
      contextAttached: Boolean(farmContext)
    });
  } catch (error) {
    if (error.code === 'GEMINI_CONFIG_MISSING') {
      return res.status(503).json({ msg: 'Crop Copilot is not configured. Add GEMINI_API_KEY in backend .env.' });
    }

    if (error.response?.status === 400) {
      return res.status(502).json({ msg: 'Gemini rejected the crop image request.' });
    }

    console.error('Crop copilot error:', error.message, {
      status: error.response?.status,
      upstream: error.response?.data,
      url: error.config?.url
    });
    return res.status(500).json({ msg: `Failed to process crop image: ${error.message}` });
  }
};