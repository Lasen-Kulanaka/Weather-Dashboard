const express = require('express');
const axios = require('axios');
const FavoriteCity = require('../models/FavoriteCity');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Search current weather for a city (no auth needed to search)
router.get('/search', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: 'City name is required' });
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;

    res.json({
  cityName: data.name,
  country: data.sys.country,
  lat: data.coord.lat,
  lon: data.coord.lon,
  temp: data.main.temp,
  feelsLike: data.main.feels_like,
  tempMin: data.main.temp_min,
  tempMax: data.main.temp_max,
  condition: data.weather[0].main,
  description: data.weather[0].description,
  icon: data.weather[0].icon,
  humidity: data.main.humidity,
  windSpeed: data.wind.speed,
  pressure: data.main.pressure,
  visibility: data.visibility,
  sunrise: data.sys.sunrise,
  sunset: data.sys.sunset
});
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: 'City not found' });
    }
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

// Get all favorites for the logged-in user
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const favorites = await FavoriteCity.find({ userId: req.userId });
    res.json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a city to favorites
router.post('/favorites', authMiddleware, async (req, res) => {
  try {
    const { cityName, lat, lon } = req.body;

    if (!cityName || lat === undefined || lon === undefined) {
      return res.status(400).json({ message: 'cityName, lat, and lon are required' });
    }

    const existing = await FavoriteCity.findOne({ userId: req.userId, cityName });
    if (existing) {
      return res.status(400).json({ message: 'City already in favorites' });
    }

    const favorite = new FavoriteCity({ userId: req.userId, cityName, lat, lon });
    await favorite.save();

    res.status(201).json(favorite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a city from favorites
router.delete('/favorites/:id', authMiddleware, async (req, res) => {
  try {
    const favorite = await FavoriteCity.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 5-day / 3-hour forecast (used for both hourly and daily views)
router.get('/forecast', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: 'City name is required' });
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric'
      }
    });

    const list = response.data.list.map((item) => ({
      dt: item.dt,
      temp: item.main.temp,
      tempMin: item.main.temp_min,
      tempMax: item.main.temp_max,
      condition: item.weather[0].main,
      icon: item.weather[0].icon,
      dateText: item.dt_txt
    }));

    res.json({
      cityName: response.data.city.name,
      timezone: response.data.city.timezone,
      list
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: 'City not found' });
    }
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch forecast data' });
  }
});

// Air quality index
router.get('/air-quality', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ message: 'lat and lon are required' });
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
      params: {
        lat,
        lon,
        appid: process.env.WEATHER_API_KEY
      }
    });

    const item = response.data.list[0];

    res.json({
      aqi: item.main.aqi, // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
      components: item.components
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch air quality data' });
  }
});

module.exports = router;