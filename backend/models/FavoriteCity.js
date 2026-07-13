const mongoose = require('mongoose');

const favoriteCitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cityName: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('FavoriteCity', favoriteCitySchema);