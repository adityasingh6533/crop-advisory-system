const express = require("express");
const router = express.Router();
const { getCurrentWeather } = require("../Controllers/currentWeather");
const { getWeatherForecast } = require("../Controllers/ForecastWeather");

router.get("/current", getCurrentWeather);
router.get("/forecast", getWeatherForecast);
module.exports = router;
