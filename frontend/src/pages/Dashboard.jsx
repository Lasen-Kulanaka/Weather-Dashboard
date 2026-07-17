import { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import FavoritesList from '../components/FavoritesList';
import WeatherBackground from '../components/WeatherBackground';
import ForecastStrip from '../components/ForecastStrip';
import HourlyForecast from '../components/HourlyForecast';
import AirQuality from '../components/AirQuality';
import LocalClock from '../components/LocalClock';

function Dashboard() {
    const [weather, setWeather] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [forecast, setForecast] = useState(null);
    const [airQuality, setAirQuality] = useState(null);
    const [timezone, setTimezone] = useState(null);

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
        setForecast(null);
        setAirQuality(null);
        setTimezone(null);

        try {
            const [weatherRes, forecastRes] = await Promise.all([
                api.get(`/weather/search?city=${city}`),
                api.get(`/weather/forecast?city=${city}`)
            ]);
            setWeather(weatherRes.data);
            setForecast(forecastRes.data.list);
            setTimezone(forecastRes.data.timezone);

            const aqRes = await api.get(`/weather/air-quality?lat=${weatherRes.data.lat}&lon=${weatherRes.data.lon}`);
            setAirQuality(aqRes.data.aqi);
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
            <WeatherBackground condition={weather?.condition} />
            <header className="dashboard-header">
                <h1>Weather Dashboard</h1>
                <div>
                    <span>Hi, {user?.name}</span>
                    <button onClick={logout}>Log Out</button>
                </div>
            </header>

            <SearchBar onSearch={handleSearch} />

            {!weather && !loading && (
                <div className="quick-picks">
                    <p className="quick-picks-label">Try one of these:</p>
                    <div className="quick-picks-row">
                        {['Colombo', 'London', 'New York', 'Tokyo', 'Dubai', 'Sydney'].map((city) => (
                            <button key={city} onClick={() => handleSearch(city)}>
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading && <p>Loading...</p>}
            {error && <p className="error-text">{error}</p>}

            <WeatherCard weather={weather} onSave={handleSave} isSaved={isSaved} />

            {weather && (
                <div className="weather-meta-row">
                    <LocalClock timezoneOffsetSeconds={timezone} />
                    <AirQuality aqi={airQuality} />
                </div>
            )}

            <HourlyForecast forecastList={forecast} />
            <ForecastStrip forecastList={forecast} />

            <FavoritesList favorites={favorites} onRemove={handleRemove} />
        </div>
    );
}

export default Dashboard;