function HourlyForecast({ forecastList }) {
  if (!forecastList || forecastList.length === 0) return null;

  const next24h = forecastList.slice(0, 8); // 8 x 3-hour steps = 24 hours

  const formatHour = (dateText) => {
    const d = new Date(dateText);
    return d.toLocaleTimeString([], { hour: 'numeric' });
  };

  return (
    <div className="hourly-forecast">
      <h3>Next 24 Hours</h3>
      <div className="hourly-row">
        {next24h.map((item) => (
          <div key={item.dateText} className="hourly-card">
            <p className="hourly-time">{formatHour(item.dateText)}</p>
            <img
              src={`https://openweathermap.org/img/wn/${item.icon}.png`}
              alt={item.condition}
            />
            <p className="hourly-temp">{Math.round(item.temp)}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;