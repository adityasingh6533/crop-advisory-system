const cropRules = [
  {
    crop: "Rice",
    season: "Kharif",
    soil: ["Clay", "Clay Loam", "Loamy"],
    temp: { min: 20, max: 35 },
    rainfall: "High",
    irrigation: ["Canal", "Rainfed"],
    humidity: "High",
    durationDays: 120,
    risk: "Low",
    reasons: [
      "Requires standing water",
      "High humidity supports growth",
      "Clay soil retains moisture well"
    ]
  },
  {
    crop: "Maize",
    season: "Kharif",
    soil: ["Loamy", "Sandy Loam"],
    temp: { min: 18, max: 30 },
    rainfall: "Moderate",
    irrigation: ["Rainfed", "Borewell"],
    humidity: "Moderate",
    durationDays: 100,
    risk: "Low",
    reasons: [
      "Good aeration required",
      "Moderate rainfall preferred",
      "Sensitive to waterlogging"
    ]
  },
  {
    crop: "Cotton",
    season: "Kharif",
    soil: ["Black", "Clay"],
    temp: { min: 21, max: 35 },
    rainfall: "Moderate",
    irrigation: ["Canal", "Borewell"],
    humidity: "Low",
    durationDays: 160,
    risk: "Moderate",
    reasons: [
      "Black soil retains moisture",
      "Requires long warm season",
      "Excess humidity invites pests"
    ]
  },
  {
    crop: "Soybean",
    season: "Kharif",
    soil: ["Loamy", "Black"],
    temp: { min: 20, max: 30 },
    rainfall: "Moderate",
    irrigation: ["Rainfed"],
    humidity: "Moderate",
    durationDays: 95,
    risk: "Low",
    reasons: [
      "Short duration crop",
      "Good nitrogen fixation",
      "Moderate water requirement"
    ]
  },
  {
    crop: "Pearl Millet",
    season: "Kharif",
    soil: ["Sandy Loam", "Loamy"],
    temp: { min: 22, max: 33 },
    rainfall: "Low",
    irrigation: ["Rainfed"],
    humidity: "Low",
    durationDays: 90,
    risk: "Low",
    reasons: [
      "Tolerates very high temperature",
      "Thrives in sandy soils",
      "Well suited for rainfed areas"
    ]
  },
  {
    crop: "Sorghum",
    season: "Kharif",
    soil: ["Loamy", "Black"],
    temp: { min: 20, max: 35 },
    rainfall: "Moderate",
    irrigation: ["Rainfed", "Borewell"],
    humidity: "Moderate",
    durationDays: 120,
    risk: "Moderate",
    reasons: [
      "Drought tolerant",
      "Less input intensive",
      "Needs balanced rainfall"
    ]
  },
  {
    crop: "Pigeon Pea",
    season: "Kharif",
    soil: ["Loamy", "Clay"],
    temp: { min: 22, max: 32 },
    rainfall: "Moderate",
    irrigation: ["Rainfed"],
    humidity: "Moderate",
    durationDays: 160,
    risk: "Moderate",
    reasons: [
      "Fixes atmospheric nitrogen",
      "Deep rooting pattern",
      "Sensitive to waterlogging"
    ]
  },
  {
    crop: "Groundnut",
    season: "Kharif",
    soil: ["Sandy Loam"],
    temp: { min: 20, max: 30 },
    rainfall: "Moderate",
    irrigation: ["Rainfed"],
    humidity: "Low",
    durationDays: 110,
    risk: "Moderate",
    reasons: [
      "Well-drained soil required",
      "Sensitive to excess moisture",
      "Oilseed crop with stable demand"
    ]
  },
  {
    crop: "Wheat",
    season: "Rabi",
    soil: ["Loamy", "Clay Loam"],
    temp: { min: 10, max: 25 },
    rainfall: "Low",
    irrigation: ["Canal", "Borewell"],
    humidity: "Low",
    durationDays: 120,
    risk: "Low",
    reasons: [
      "Cool climate required",
      "Sensitive to high temperature",
      "Needs controlled irrigation"
    ]
  },
  {
    crop: "Mustard",
    season: "Rabi",
    soil: ["Sandy Loam", "Loamy"],
    temp: { min: 10, max: 25 },
    rainfall: "Low",
    irrigation: ["Rainfed", "Canal"],
    humidity: "Low",
    durationDays: 90,
    risk: "Low",
    reasons: [
      "Drought tolerant",
      "Low water requirement",
      "Oilseed crop"
    ]
  },
  {
    crop: "Chickpea",
    season: "Rabi",
    soil: ["Loamy", "Sandy"],
    temp: { min: 8, max: 25 },
    rainfall: "Low",
    irrigation: ["Rainfed"],
    humidity: "Low",
    durationDays: 100,
    risk: "Low",
    reasons: [
      "Legume crop improves soil",
      "Prefers dry climate",
      "Sensitive to excess water"
    ]
  },
  {
    crop: "Lentil",
    season: "Rabi",
    soil: ["Loamy", "Clay Loam"],
    temp: { min: 10, max: 25 },
    rainfall: "Low",
    irrigation: ["Rainfed", "Canal"],
    humidity: "Low",
    durationDays: 100,
    risk: "Low",
    reasons: [
      "Short duration pulse",
      "Needs cool, dry finish",
      "Improves soil nitrogen"
    ]
  },
  {
    crop: "Potato",
    season: "Rabi",
    soil: ["Loamy", "Sandy Loam"],
    temp: { min: 15, max: 22 },
    rainfall: "Moderate",
    irrigation: ["Canal", "Borewell"],
    humidity: "Moderate",
    durationDays: 150,
    risk: "Moderate",
    reasons: [
      "Prefers steady moisture",
      "Cool temperature requirement",
      "High market demand"
    ]
  },
  {
    crop: "Tomato",
    season: "Rabi",
    soil: ["Loamy"],
    temp: { min: 18, max: 28 },
    rainfall: "Low",
    irrigation: ["Canal", "Borewell"],
    humidity: "Moderate",
    durationDays: 120,
    risk: "Moderate",
    reasons: [
      "Needs steady irrigation",
      "Sensitive to frost",
      "High labor intensity"
    ]
  },
  {
    crop: "Watermelon",
    season: "Zaid",
    soil: ["Sandy", "Sandy Loam"],
    temp: { min: 22, max: 35 },
    rainfall: "Low",
    irrigation: ["Borewell"],
    humidity: "Low",
    durationDays: 80,
    risk: "Moderate",
    reasons: [
      "Requires warm temperature",
      "Sandy soil prevents waterlogging",
      "Needs frequent light irrigation"
    ]
  },
  {
    crop: "Cucumber",
    season: "Zaid",
    soil: ["Sandy Loam", "Loamy"],
    temp: { min: 20, max: 35 },
    rainfall: "Low",
    irrigation: ["Borewell"],
    humidity: "Moderate",
    durationDays: 60,
    risk: "Low",
    reasons: [
      "Fast growing vegetable",
      "High market demand",
      "Prefers warm climate"
    ]
  },
  {
    crop: "Sugarcane",
    season: "Annual",
    soil: ["Loamy", "Clay Loam"],
    temp: { min: 20, max: 38 },
    rainfall: "High",
    irrigation: ["Canal"],
    humidity: "High",
    durationDays: 300,
    risk: "High",
    reasons: [
      "Long duration crop",
      "High water requirement",
      "High investment but high return"
    ]
  }
];

module.exports = cropRules;
