const getCropRecommendation = (req, res) => {
  try {
    const { cropInput, weatherSummary } = req.body;

    if (!cropInput || !weatherSummary) {
      return res.status(400).json({ message: "Incomplete data" });
    }

    const { season, soilType, irrigationType, location } = cropInput;

    const {
      avgTemp,
      totalRain,
      rainyDays = 0,
      hotDays = 0,
      coldDays = 0,
      humidityAvg = 50,
      windRisk = "Low",
    } = weatherSummary;

    /* ===============================
       BASE CROPS (STRICT BY SEASON)
    =============================== */
    const SEASON_CROPS = {
      Rabi: ["Wheat", "Mustard", "Gram", "Pea", "Lentil"],
      Kharif: ["Rice", "Maize", "Cotton", "Soybean"],
      Zaid: ["Vegetables", "Watermelon", "Cucumber"],
    };

    const baseCrops = SEASON_CROPS[season] || [];
    let cropScore = {};
    let reasons = [];
    let riskLevel = "Low";
    let advisory = "Conditions are suitable for sowing.";

    baseCrops.forEach(c => (cropScore[c] = 0));

    /* ===============================
       TEMPERATURE RULES
    =============================== */
    baseCrops.forEach(crop => {
      if (avgTemp >= 15 && avgTemp <= 30) cropScore[crop] += 2;
      else if (avgTemp >= 10 && avgTemp <= 35) cropScore[crop] += 1;
      else cropScore[crop] -= 3;
    });

    if (avgTemp < 10 || avgTemp > 35) {
      riskLevel = "High";
      advisory = "Extreme temperature detected. Sowing not advised.";
      reasons.push("Temperature outside safe germination range");
    }

    /* ===============================
       RAINFALL + IRRIGATION
    =============================== */
    if (totalRain < 30 && irrigationType === "Rainfed") {
      riskLevel = "High";
      advisory = "Rainfed farming risky due to low rainfall.";
      reasons.push("Insufficient rainfall for rainfed farming");
      Object.keys(cropScore).forEach(c => (cropScore[c] -= 2));
    }

    if (rainyDays >= 4) {
      Object.keys(cropScore).forEach(c => (cropScore[c] += 1));
      reasons.push("Rainfall distribution acceptable");
    }

    /* ===============================
       HEAT / COLD STRESS
    =============================== */
    if (hotDays >= 3) {
      riskLevel = "High";
      advisory = "Heat stress expected. Delay sowing.";
      ["Wheat", "Pea", "Mustard"].forEach(c => {
        if (cropScore[c] !== undefined) cropScore[c] -= 3;
      });
      reasons.push("Multiple hot days expected");
    }

    if (coldDays >= 3) {
      ["Rice", "Cotton"].forEach(c => {
        if (cropScore[c] !== undefined) cropScore[c] -= 3;
      });
      reasons.push("Cold stress risk detected");
    }

    /* ===============================
       HUMIDITY & WIND
    =============================== */
    if (humidityAvg > 75) {
      riskLevel = riskLevel === "High" ? "High" : "Moderate";
      reasons.push("High humidity increases disease risk");
    }

    if (windRisk === "High") {
      ["Maize", "Cotton"].forEach(c => {
        if (cropScore[c] !== undefined) cropScore[c] -= 2;
      });
      reasons.push("Strong winds may damage tall crops");
    }

    /* ===============================
       SOIL SUITABILITY
    =============================== */
    if (soilType === "Clay") {
      ["Rice", "Wheat"].forEach(c => {
        if (cropScore[c] !== undefined) cropScore[c] += 2;
      });
      reasons.push("Clay soil retains moisture well");
    }

    if (soilType === "Sandy") {
      ["Rice", "Wheat"].forEach(c => {
        if (cropScore[c] !== undefined) cropScore[c] -= 2;
      });
      reasons.push("Sandy soil drains moisture quickly");
    }

    if (soilType === "Loamy") {
      Object.keys(cropScore).forEach(c => (cropScore[c] += 1));
      reasons.push("Loamy soil suitable for most crops");
    }

    /* ===============================
       FINAL SAFE CROPS
    =============================== */
    const recommendedCrops = Object.keys(cropScore).filter(
      c => cropScore[c] >= 2
    );

    /* ===============================
       DELAY SOWING CASE
    =============================== */
    if (recommendedCrops.length === 0) {
      return res.json({
        location,
        decision: "DELAY_SOWING",
        recommendedCrops: [],
        riskLevel: "High",
        advisory: "Weather and soil conditions unsafe for sowing right now.",
        actionPlan: [
          "Delay sowing for 7–10 days",
          "Recheck forecast after next rainfall",
          "Prepare field and inputs meanwhile",
        ],
        reasons,
        confidence: "≈85% (rule-based agronomic logic)",
      });
    }

    /* ===============================
       NORMAL SOWING
    =============================== */
    return res.json({
      location,
      decision: "SOW_NOW",
      recommendedCrops,
      riskLevel,
      advisory,
      reasons,
      confidence: "≈85% (rule-based agronomic logic)",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Recommendation failed" });
  }
};

module.exports = { getCropRecommendation };