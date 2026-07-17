function ForecastStrip({ forecastList }) {
  if (!forecastList || forecastList.length === 0) return null;

  // The API gives 3-hour steps for 5 days (~40 entries).
  // Pick one entry per day, closest to midday, to represent that day.
  const dailyMap = {};
  forecastList.forEach((item) => {
    const date = item.dateText.split(' ')[0];
    const hour = item.dateText.split(' ')[1];
    if (!dailyMap[date] || hour === '12:00:00') {
      dailyMap[date] = item;
    }
  });

  const days = Object.values(dailyMap).slice(0, 5);

  const formatDay = (dateText) => {
    const d = new Date(dateText);
    return d.toLocaleDateString([], { weekday: 'short' });
  };

  return (
    <div className="forecast-strip">
      <h3>5-Day Forecast</h3>
      <div className="forecast-strip-row">
        {days.map((day) => (
          <div key={day.dateText} className="forecast-day-card">
            <p className="forecast-day-name">{formatDay(day.dateText)}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.condition}
            />
            <p className="forecast-temp">{Math.round(day.temp)}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastStrip;