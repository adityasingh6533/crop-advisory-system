const express = require("express");
const { getCropRecommendation } = require("../Controllers/recommendation");

const router = express.Router();

router.post("/recommend", getCropRecommendation);

module.exports = router;
