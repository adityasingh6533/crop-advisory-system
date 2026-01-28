import "../css/Forecast.css";

const Forecast = () => {
  return (
    <div className="weather-page">

      {/* HEADER */}
      <div className="weather-header">
        <h1>Weather Forecast</h1>
        <p>Location: <span>Aligarh</span></p>
      </div>

      {/* CURRENT WEATHER */}
      <div className="weather-main-card">
        <div className="temp-section">
          <h2>28°C</h2>
          <span>Partly Cloudy</span>
        </div>

        <div className="weather-meta">
          <p><b>Humidity:</b> 65%</p>
          <p><b>Rainfall:</b> Light</p>
          <p><b>Wind:</b> 10 km/h</p>
        </div>
      </div>

      {/* FORECAST */}
      <h2 className="forecast-title">Next 7 Days Trend</h2>

      <div className="forecast-row">
        <div className="day">Mon 🌧️<br />27°</div>
        <div className="day">Tue ☁️<br />29°</div>
        <div className="day">Wed 🌦️<br />28°</div>
        <div className="day">Thu ☀️<br />30°</div>
        <div className="day">Fri 🌦️<br />29°</div>
        <div className="day">Sat 🌧️<br />27°</div>
        <div className="day">Sun ☁️<br />28°</div>
      </div>

      {/* SEASONAL INSIGHT */}
      <div className="seasonal-insight">
        <h3>Seasonal Insight</h3>
        <p>
          Weather conditions over the next <b>7–14 days</b> indicate
          <b> moderate rainfall</b> with stable temperatures.
          These conditions are favorable for ongoing
          <b> Kharif crop growth</b>.
        </p>
      </div>

    </div>
  );
};

export default Forecast;
