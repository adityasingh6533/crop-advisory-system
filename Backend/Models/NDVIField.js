const mongoose = require("mongoose");

const PointSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  { _id: false }
);

const ScanSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, default: Date.now },
    healthScore: { type: Number, required: true },
    healthStatus: { type: String, required: true },
    riskLevel: { type: String, required: true },
    meanNdvi: { type: Number, required: true },
    minNdvi: { type: Number, required: true },
    maxNdvi: { type: Number, required: true },
    coveragePercent: { type: Number, required: true },
    uniformityScore: { type: Number, required: true },
    urgency: { type: String, required: true },
  },
  { _id: true }
);

const NDVIFieldSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    locationLabel: { type: String, trim: true, default: "" },
    center: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    geometry: { type: Object, required: true },
    bbox: { type: [Number], required: true },
    fieldPoints: { type: [PointSchema], required: true },
    lastStats: { type: Object, default: null },
    scans: { type: [ScanSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NDVIField", NDVIFieldSchema);
