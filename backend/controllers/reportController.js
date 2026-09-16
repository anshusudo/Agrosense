const Farm = require('../models/Farm');
const { getRecommendation, getTopCropsWithYieldAnalysis } = require('../services/recommendationEngine');
const { generateStatistics, analyzeCropRecommendations } = require('../services/analyticsEngine');
const { generateAIReport } = require('../services/pdfServices');
const { sendAIReport } = require('../services/emailService');
const User = require('../models/User');
const { getWeatherByCity } = require('../services/weatherService');

exports.sendAIReport = async (req, res) => {
  try {
    // 1. Get farm
    const farm = await Farm.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({ msg: 'Farm not found' });
    }

    // 2. Get user (farmer)
    const user = await User.findById(req.user.userId);

    // 3. Fetch weather
    const city = farm.city;
    if (!city) {
      return res.status(400).json({ msg: 'Farm city is missing. Please update farm location.' });
    }
    const weather = await getWeatherByCity(city);

    // 4. AI Recommendation
    const recommendation = getRecommendation({
      crop: farm.crop,
      soilType: farm.soilType,
      area: farm.area,
      weather
    });

    // 5. Generate advanced statistics
    const statistics = generateStatistics(
      {
        crop: farm.crop,
        soilType: farm.soilType,
        area: farm.area,
        weather
      },
      recommendation
    );

    // 6. Get alternative crop recommendations with yield analysis
    const cropRecommendations = analyzeCropRecommendations(
      weather,
      farm.soilType,
      farm.area
    );

    // 7. Prepare report data
    const reportData = {
      farm,
      weather,
      recommendation,
      statistics,
      cropRecommendations
    };

    // 8. Generate PDF
    const pdfBuffer = await generateAIReport(reportData);

    // 9. Send email
    await sendAIReport(user.email, pdfBuffer, reportData);

    // 10. Response
    res.json({ msg: 'Report generated and emailed successfully' });

  } catch (err) {
    console.error('Report error:', err);
    res.status(500).json({ msg: 'Failed to generate and send report', error: err.message });
  }
};
