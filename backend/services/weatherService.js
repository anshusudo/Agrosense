const axios = require('axios');

const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5/weather';
const GEO_API_BASE = 'https://api.openweathermap.org/geo/1.0/direct';
const WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;
const weatherCache = new Map();

function buildWeatherResponse(weatherData, inputCity) {
  return {
    city: inputCity || weatherData?.name,
    temperature: weatherData.main?.temp,
    humidity: weatherData.main?.humidity,
    condition: weatherData.weather?.[0]?.description || 'N/A',
    rainfall: weatherData.rain?.['1h'] || 0,
    windSpeed: weatherData.wind?.speed || 0
  };
}

async function fetchWeatherByQuery(query, apiKey) {
  const response = await axios.get(WEATHER_API_BASE, {
    params: {
      q: query,
      appid: apiKey,
      units: 'metric'
    }
  });
  return response.data;
}

async function fetchWeatherByCoordinates(lat, lon, apiKey) {
  const response = await axios.get(WEATHER_API_BASE, {
    params: {
      lat,
      lon,
      appid: apiKey,
      units: 'metric'
    }
  });
  return response.data;
}

function createWeatherError(message, status = 500) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function getCachedWeather(cityKey) {
  const cached = weatherCache.get(cityKey);
  if (!cached) return null;

  if (cached.expiresAt < Date.now()) {
    weatherCache.delete(cityKey);
    return null;
  }

  return cached.data;
}

function setCachedWeather(cityKey, data) {
  weatherCache.set(cityKey, {
    data,
    expiresAt: Date.now() + WEATHER_CACHE_TTL_MS
  });
}

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s,]/g, '');
}

function splitQuery(query) {
  const parts = String(query || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    cityPart: normalizeText(parts[0] || query),
    statePart: normalizeText(parts[1] || ''),
    countryPart: normalizeText(parts[2] || '')
  };
}

function locationMatchesText(location, normalizedText) {
  if (!normalizedText) return false;
  const locationName = normalizeText(location?.name);
  if (locationName === normalizedText) return true;

  const localNames = location?.local_names ? Object.values(location.local_names) : [];
  return localNames.some((name) => normalizeText(name) === normalizedText);
}

function scoreLocation(location, queryParts) {
  let score = 0;

  if (locationMatchesText(location, queryParts.cityPart)) {
    score += 100;
  } else if (normalizeText(location?.name).includes(queryParts.cityPart)) {
    score += 40;
  }

  if (queryParts.statePart && normalizeText(location?.state).includes(queryParts.statePart)) {
    score += 20;
  }

  if (queryParts.countryPart) {
    if (normalizeText(location?.country) === queryParts.countryPart) {
      score += 15;
    }
  } else if (normalizeText(location?.country) === 'in') {
    score += 10;
  }

  return score;
}

async function resolveCityCoordinates(city, apiKey) {
  const queryParts = splitQuery(city);
  const geoResponse = await axios.get(GEO_API_BASE, {
    params: {
      q: city,
      limit: 10,
      appid: apiKey
    }
  });

  const geoResults = Array.isArray(geoResponse.data) ? geoResponse.data : [];
  if (geoResults.length === 0) {
    return null;
  }

  const scored = geoResults
    .map((location) => ({
      location,
      score: scoreLocation(location, queryParts)
    }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score <= 0) {
    return null;
  }

  return best.location;
}

async function getWeatherByCity(cityInput) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw createWeatherError('WEATHER_API_KEY is missing', 500);
  }

  const city = String(cityInput || '').trim();
  if (!city) {
    throw createWeatherError('City is required', 400);
  }

  const cityCacheKey = normalizeText(city);
  const cachedWeather = getCachedWeather(cityCacheKey);
  if (cachedWeather) {
    return cachedWeather;
  }

  const attempts = [];

  try {
    const location = await resolveCityCoordinates(city, apiKey);
    if (location?.lat !== undefined && location?.lon !== undefined) {
      const weatherData = await fetchWeatherByCoordinates(location.lat, location.lon, apiKey);
      const weather = buildWeatherResponse(weatherData, city);
      setCachedWeather(cityCacheKey, weather);
      return weather;
    }
  } catch (error) {
    attempts.push(error);
  }

  try {
    const weatherData = await fetchWeatherByQuery(city, apiKey);
    const weather = buildWeatherResponse(weatherData, city);
    setCachedWeather(cityCacheKey, weather);
    return weather;
  } catch (error) {
    attempts.push(error);
  }

  try {
    const weatherData = await fetchWeatherByQuery(`${city},IN`, apiKey);
    const weather = buildWeatherResponse(weatherData, city);
    setCachedWeather(cityCacheKey, weather);
    return weather;
  } catch (error) {
    attempts.push(error);
  }

  const openWeatherMessage = attempts
    .map((error) => error?.response?.data?.message)
    .filter(Boolean)
    .join(' | ');

  throw createWeatherError(
    openWeatherMessage
      ? `Unable to fetch weather for city "${city}". ${openWeatherMessage}`
      : `Unable to fetch weather for city "${city}". Please check spelling or try a nearby city.`,
    404
  );
}

module.exports = { getWeatherByCity };
