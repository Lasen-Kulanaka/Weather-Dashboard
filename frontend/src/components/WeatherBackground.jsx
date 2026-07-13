function WeatherBackground({ condition }) {
  const normalized = (condition || '').toLowerCase();

  const renderLayer = () => {
    if (normalized.includes('rain') || normalized.includes('drizzle')) {
      return (
        <div className="bg-rain">
          {Array.from({ length: 60 }).map((_, i) => (
            <span
              key={i}
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${0.5 + Math.random() * 0.6}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      );
    }

    if (normalized.includes('snow')) {
      return (
        <div className="bg-snow">
          {Array.from({ length: 50 }).map((_, i) => (
            <span
              key={i}
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${4 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${8 + Math.random() * 10}px`
              }}
            >
              ❄
            </span>
          ))}
        </div>
      );
    }

    if (normalized.includes('thunderstorm')) {
      return (
        <div className="bg-thunder">
          <div className="bg-rain">
            {Array.from({ length: 60 }).map((_, i) => (
              <span
                key={i}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${0.4 + Math.random() * 0.5}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          <div className="lightning-flash" />
        </div>
      );
    }

    if (normalized.includes('cloud')) {
      return (
        <div className="bg-clouds">
          <div className="cloud cloud1" />
          <div className="cloud cloud2" />
          <div className="cloud cloud3" />
        </div>
      );
    }

    if (normalized.includes('clear')) {
      return (
        <div className="bg-clear">
          <div className="sun-glow" />
        </div>
      );
    }

    if (normalized.includes('mist') || normalized.includes('fog') || normalized.includes('haze')) {
      return (
        <div className="bg-mist">
          <div className="mist-layer mist1" />
          <div className="mist-layer mist2" />
        </div>
      );
    }

    return null;
  };

  return <div className="weather-bg">{renderLayer()}</div>;
}

export default WeatherBackground;