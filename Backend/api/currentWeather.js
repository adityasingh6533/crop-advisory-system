const express = require("express");
const router = express.Router();
const { getCurrentWeather } = require("../Controllers/currentWeather");

router.get("/current", getCurrentWeather);

module.exports = router;
