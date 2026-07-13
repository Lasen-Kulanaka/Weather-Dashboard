function WeatherCard({ weather, onSave, isSaved }) {
  if (!weather) return null;

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <h3>{weather.cityName}</h3>
        {onSave && (
          <button onClick={() => onSave(weather)} disabled={isSaved}>
            {isSaved ? 'Saved' : 'Save to Favorites'}
          </button>
        )}
      </div>
      <p className="temp">{Math.round(weather.temp)}°C</p>
      <p className="condition">{weather.condition} — {weather.description}</p>
      <div className="weather-details">
        <span>Feels like: {Math.round(weather.feelsLike)}°C</span>
        <span>Humidity: {weather.humidity}%</span>
        <span>Wind: {weather.windSpeed} m/s</span>
      </div>
    </div>
  );
}

export default WeatherCard;