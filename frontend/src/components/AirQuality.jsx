function AirQuality({ aqi }) {
  if (!aqi) return null;

  const levels = {
    1: { label: 'Good', color: '#4ade80' },
    2: { label: 'Fair', color: '#a3e635' },
    3: { label: 'Moderate', color: '#facc15' },
    4: { label: 'Poor', color: '#fb923c' },
    5: { label: 'Very Poor', color: '#f87171' }
  };

  const level = levels[aqi] || levels[3];

  return (
    <div className="air-quality-card">
      <span className="aqi-label">Air Quality</span>
      <div className="aqi-badge" style={{ backgroundColor: level.color }}>
        {level.label}
      </div>
    </div>
  );
}

export default AirQuality;