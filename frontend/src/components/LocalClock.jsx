import { useState, useEffect } from 'react';

function LocalClock({ timezoneOffsetSeconds }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (timezoneOffsetSeconds === undefined) return null;

  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const cityTime = new Date(utcMs + timezoneOffsetSeconds * 1000);

  const hours = cityTime.getHours();
  const isDay = hours >= 6 && hours < 18;

  const timeString = cityTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="local-clock">
      <span className="clock-icon">{isDay ? '☀️' : '🌙'}</span>
      <span>{timeString} local time</span>
    </div>
  );
}

export default LocalClock;