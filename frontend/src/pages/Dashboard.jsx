import { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import FavoritesList from '../components/FavoritesList';

function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, logout } = useAuth();

  const loadFavorites = async () => {
    try {
      const res = await api.get('/weather/favorites');
      setFavorites(res.data);
    } catch (err) {
      console.error('Failed to load favorites');
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleSearch = async (city) => {
    setError('');
    setLoading(true);
    setWeather(null);

    try {
      const res = await api.get(`/weather/search?city=${city}`);
      setWeather(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (weatherData) => {
    try {
      await api.post('/weather/favorites', {
        cityName: weatherData.cityName,
        lat: weatherData.lat,
        lon: weatherData.lon
      });
      loadFavorites();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save favorite');
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/weather/favorites/${id}`);
      setFavorites((prev) => prev.filter((fav) => fav._id !== id));
    } catch (err) {
      console.error('Failed to remove favorite');
    }
  };

  const isSaved = weather && favorites.some((fav) => fav.cityName === weather.cityName);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Weather Dashboard</h1>
        <div>
          <span>Hi, {user?.name}</span>
          <button onClick={logout}>Log Out</button>
        </div>
      </header>

      <SearchBar onSearch={handleSearch} />

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      <WeatherCard weather={weather} onSave={handleSave} isSaved={isSaved} />

      <FavoritesList favorites={favorites} onRemove={handleRemove} />
    </div>
  );
}

export default Dashboard;