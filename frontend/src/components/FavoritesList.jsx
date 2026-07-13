import { useEffect, useState } from 'react';
import api from '../api/api';
import WeatherCard from './WeatherCard';

function FavoritesList({ favorites, onRemove }) {
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    favorites.forEach(async (fav) => {
      try {
        const res = await api.get(`/weather/search?city=${fav.cityName}`);
        setWeatherData((prev) => ({ ...prev, [fav._id]: res.data }));
      } catch (err) {
        console.error('Failed to fetch weather for', fav.cityName);
      }
    });
  }, [favorites]);

  if (favorites.length === 0) {
    return <p className="empty-text">No favorite cities yet. Search and save one above!</p>;
  }

  return (
    <div className="favorites-list">
      <h3>Favorites</h3>
      <div className="favorites-grid">
        {favorites.map((fav) => (
          <div key={fav._id} className="favorite-item">
            <WeatherCard weather={weatherData[fav._id]} />
            <button className="remove-btn" onClick={() => onRemove(fav._id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesList;