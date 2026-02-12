const getCropRecommendation = (req, res) => {
  try {
    // Frontend se 'lang' bhi mangwa lo (default 'en')
    const { cropInput, weatherSummary, lang = "en" } = req.body;

    if (!cropInput || !weatherSummary) {
      return res.status(400).json({ message: "Incomplete data" });
    }

    const { season, soilType, irrigationType, location } = cropInput;
    const { avgTemp, totalRain, rainyDays = 0, hotDays = 0, coldDays = 0 } = weatherSummary;

    // Translations Object
    const i18n = {
      en: {
        safe: "Conditions are suitable for sowing.",
        extremeTemp: "Extreme temperature detected. Sowing not advised.",
        tempRange: "Temperature outside safe germination range",
        rainfedRisk: "Rainfed farming risky due to low rainfall.",
        lowRain: "Insufficient rainfall for rainfed farming",
        rainDist: "Rainfall distribution acceptable",
        heatStress: "Heat stress expected. Delay sowing.",
        hotDays: "Multiple hot days expected",
        coldStress: "Cold stress risk detected",
        claySoil: "Clay soil retains moisture well",
        sandySoil: "Sandy soil drains moisture quickly",
        loamySoil: "Loamy soil suitable for most crops",
        delaySowing: "Weather and soil conditions unsafe for sowing right now.",
        action1: "Delay sowing for 7–10 days",
        action2: "Recheck forecast after next rainfall",
        action3: "Prepare field and inputs meanwhile",
        confidence: "≈85% (rule-based agronomic logic)"
      },
      hi: {
        safe: "बुवाई के लिए स्थितियां उपयुक्त हैं।",
        extremeTemp: "अत्यधिक तापमान दर्ज किया गया। बुवाई की सलाह नहीं दी जाती।",
        tempRange: "तापमान सुरक्षित अंकुरण सीमा से बाहर है",
        rainfedRisk: "कम बारिश के कारण वर्षा आधारित खेती जोखिम भरी है।",
        lowRain: "वर्षा आधारित खेती के लिए अपर्याप्त वर्षा",
        rainDist: "वर्षा का वितरण स्वीकार्य है",
        heatStress: "गर्मी का तनाव (Heat stress) होने की संभावना। बुवाई में देरी करें।",
        hotDays: "कई गर्म दिन होने की उम्मीद है",
        coldStress: "ठंड के तनाव का जोखिम पाया गया",
        claySoil: "चिकनी मिट्टी नमी को अच्छी तरह बरकरार रखती है",
        sandySoil: "रेतीली मिट्टी से नमी जल्दी निकल जाती है",
        loamySoil: "दोमट मिट्टी अधिकांश फसलों के लिए उपयुक्त है",
        delaySowing: "अभी बुवाई के लिए मौसम और मिट्टी की स्थिति असुरक्षित है।",
        action1: "बुवाई में 7-10 दिनों की देरी करें",
        action2: "अगली बारिश के बाद पूर्वानुमान फिर से जांचें",
        action3: "इस बीच खेत और इनपुट तैयार करें",
        confidence: "≈85% (नियम-आधारित कृषि विज्ञान तर्क)"
      }
    };

    const t = i18n[lang] || i18n.en; // Current language selector

    const SEASON_CROPS = {
      Rabi: ["Wheat", "Mustard", "Gram", "Pea", "Lentil"],
      Kharif: ["Rice", "Maize", "Cotton", "Soybean"],
      Zaid: ["Vegetables", "Watermelon", "Cucumber"],
    };

    const baseCrops = SEASON_CROPS[season] || [];
    let cropScore = {};
    let reasons = [];
    let riskLevel = "Low";
    let advisory = t.safe;

    baseCrops.forEach(c => (cropScore[c] = 0));

    // Temperature Rules
    if (avgTemp < 10 || avgTemp > 35) {
      riskLevel = "High";
      advisory = t.extremeTemp;
      reasons.push(t.tempRange);
    }

    // Rainfall Rules
    if (totalRain < 30 && irrigationType === "Rainfed") {
      riskLevel = "High";
      advisory = t.rainfedRisk;
      reasons.push(t.lowRain);
    }

    if (rainyDays >= 4) reasons.push(t.rainDist);

    // Stress Rules
    if (hotDays >= 3) {
      riskLevel = "High";
      advisory = t.heatStress;
      reasons.push(t.hotDays);
    }

    if (coldDays >= 3) reasons.push(t.coldStress);

    // Soil Rules
    if (soilType === "Clay") reasons.push(t.claySoil);
    if (soilType === "Sandy") reasons.push(t.sandySoil);
    if (soilType === "Loamy") reasons.push(t.loamySoil);

    const recommendedCrops = Object.keys(cropScore).filter(c => cropScore[c] >= 0); // Logic simplified for demo

    if (recommendedCrops.length === 0 || riskLevel === "High") {
      return res.json({
        location,
        decision: "DELAY_SOWING",
        recommendedCrops: [],
        riskLevel: "High",
        advisory: t.delaySowing,
        actionPlan: [t.action1, t.action2, t.action3],
        reasons,
        confidence: t.confidence,
      });
    }

    return res.json({
      location,
      decision: "SOW_NOW",
      recommendedCrops,
      riskLevel,
      advisory,
      reasons,
      confidence: t.confidence,
    });

  } catch (err) {
    res.status(500).json({ message: "Recommendation failed" });
  }
};

module.exports={getCropRecommendation}