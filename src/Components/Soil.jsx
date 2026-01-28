import "../css/Soil.css";

function Soil() {
  const soilType = "Black Soil";

  return (
    <div className="soil-page soil-theme">

      <div className="soil-header">
        <h1>Soil Recommendation</h1>
        <p>Soil matters more than weather for crops</p>
      </div>

      <div className="soil-badge">
        🟤 {soilType}
      </div>

      <div className="soil-main-card">
        <h2>About {soilType}</h2>
        <p>
          Black soil is rich in clay and organic matter. It retains moisture
          for a long time and is ideal for water-intensive crops.
        </p>
      </div>

      <div className="soil-info-grid">

        <div className="soil-card">
          <h3>Characteristics</h3>
          <ul>
            <li>High clay content</li>
            <li>Excellent water retention</li>
            <li>Rich in minerals</li>
          </ul>
        </div>

        <div className="soil-card">
          <h3>Best Crops</h3>
          <ul>
            <li>Cotton</li>
            <li>Soybean</li>
            <li>Sugarcane</li>
          </ul>
        </div>

        <div className="soil-card">
          <h3>Farmer Tips</h3>
          <ul>
            <li>Do not over-irrigate</li>
            <li>Plough properly before sowing</li>
            <li>Use organic manure</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default Soil;
