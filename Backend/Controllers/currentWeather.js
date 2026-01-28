const getCurrentWeather = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "WEATHER_API_KEY is not set" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to fetch weather data",
        error: data?.message || "Upstream weather API error",
      });
    }

    const weatherData = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].description,
      windSpeed: data.wind.speed,
      visibility: data.visibility,
      rainfall: data.rain ? data.rain["1h"] || 0 : 0,
    };

    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch weather data",
      error: error.message,
    });
  }
};

module.exports = { getCurrentWeather };
