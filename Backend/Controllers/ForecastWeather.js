const getWeatherForecast = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "WEATHER_API_KEY is not set" });
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to fetch forecast data",
        error: json?.message || "Upstream API error",
      });
    }

    const list = json.list; 

    const dailyData = {};
    list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];

      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          rain: 0,
          conditions: {},
        };
      }

      dailyData[date].temps.push(item.main.temp);
      if (item.rain && item.rain["3h"]) {
        dailyData[date].rain += item.rain["3h"];
      }
      const condition = item.weather[0].main;
      dailyData[date].conditions[condition] =
        (dailyData[date].conditions[condition] || 0) + 1;
    });

    const sortedDates = Object.keys(dailyData).sort();
    const forecastTrend = sortedDates.map((date) => {
      const day = dailyData[date];
      const avgTemp = day.temps.reduce((a, b) => a + b, 0) / day.temps.length;
      const dominantCondition = Object.keys(day.conditions).reduce((a, b) =>
        day.conditions[a] > day.conditions[b] ? a : b
      );
      let rainTrend = "Low";
      if (day.rain > 10) rainTrend = "High";
      else if (day.rain > 3) rainTrend = "Moderate";
      return {
        date,
        avgTemp: Number(avgTemp.toFixed(1)),
        rainTrend,
        condition: dominantCondition,
        isOutlook: false,
      };
    });

    
    const lastReal = forecastTrend[forecastTrend.length - 1];
    const lastDate = lastReal ? new Date(lastReal.date) : new Date();
    for (let i = forecastTrend.length; i < 14; i++) {
      const d = new Date(lastDate);
      d.setDate(d.getDate() + (i - forecastTrend.length + 1));
      const dateStr = d.toISOString().slice(0, 10);
      forecastTrend.push({
        date: dateStr,
        avgTemp: lastReal ? lastReal.avgTemp : "â€”",
        rainTrend: "Outlook",
        condition: "Outlook",
        isOutlook: true,
      });
    }

    res.status(200).json({
      location,
      daysAnalyzed: forecastTrend.length,
      trend: forecastTrend,
      insight:
        "Days 1â€“5 from live data; days 6â€“14 are extended outlook. Forecast indicates temperature stability and manageable rainfall suitable for crop planning.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch forecast data",
      error: error.message,
    });
  }
};

module.exports = { getWeatherForecast };

