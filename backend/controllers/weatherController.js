const { getWeatherByCity } = require('../services/weatherService');

exports.getWeather = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city || !String(city).trim()) {
      return res.status(400).json({ msg: 'City is required' });
    }

    const weather = await getWeatherByCity(city);
    return res.json(weather);
  } catch (err) {
    return res.status(err.status || 500).json({ msg: err.message || 'Weather fetch failed' });
  }
};
