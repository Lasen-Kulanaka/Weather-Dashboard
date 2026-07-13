function WeatherCard({ weather, onSave, isSaved }) {
  if (!weather) return null;

  const formatTime = (unixSeconds) => {
    return new Date(unixSeconds * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <h3>{weather.cityName}{weather.country ? `, ${weather.country}` : ''}</h3>
        {onSave && (
          <button onClick={() => onSave(weather)} disabled={isSaved}>
            {isSaved ? 'Saved' : 'Save to Favorites'}
          </button>
        )}
      </div>

      <div className="temp-row">
        {weather.icon && (
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.condition}
          />
        )}
        <p className="temp">{Math.round(weather.temp)}°C</p>
      </div>

      <p className="condition">{weather.condition} — {weather.description}</p>

      {weather.tempMin !== undefined && (
        <p className="min-max">
          H: {Math.round(weather.tempMax)}° &nbsp; L: {Math.round(weather.tempMin)}°
        </p>
      )}

      <div className="weather-details">
        <span>Feels like: {Math.round(weather.feelsLike)}°C</span>
        <span>Humidity: {weather.humidity}%</span>
        <span>Wind: {weather.windSpeed} m/s</span>
        {weather.pressure && <span>Pressure: {weather.pressure} hPa</span>}
        {weather.visibility !== undefined && <span>Visibility: {(weather.visibility / 1000).toFixed(1)} km</span>}
        {weather.sunrise && <span>Sunrise: {formatTime(weather.sunrise)}</span>}
        {weather.sunset && <span>Sunset: {formatTime(weather.sunset)}</span>}
      </div>
    </div>
  );
}

export default WeatherCard;