const NDVIField = require("../Models/NDVIField");
const { fetchNDVI, fetchNDVIStats } = require("../service/sentinalService");
const getUserId = (req) => req.user?.id;

const ensureBbox = (bbox, res) => {
  if (!bbox) {
    res.status(400).json({ error: "bbox required" });
    return false;
  }

  return true;
};

const getNDVIImage = async (req, res) => {
  try {
    const { bbox, geometry } = req.body;

    if (!ensureBbox(bbox, res)) {
      return;
    }

    const imageBuffer = await fetchNDVI({ bbox, geometry });

    res.set("Content-Type", "image/png");
    return res.send(imageBuffer);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      error: error.message || "NDVI fetch failed",
    });
  }
};

const getNDVIStats = async (req, res) => {
  try {
    const { bbox, geometry } = req.body;

    if (!ensureBbox(bbox, res)) {
      return;
    }

    const stats = await fetchNDVIStats({ bbox, geometry });
    return res.json(stats);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      error: error.message || "NDVI stats fetch failed",
    });
  }
};

const listSavedFields = async (req, res) => {
  try {
    const fields = await NDVIField.find({ userId: getUserId(req) })
      .sort({ updatedAt: -1 })
      .lean();

    return res.json({
      fields: fields.map((field) => ({
        _id: field._id,
        name: field.name,
        locationLabel: field.locationLabel,
        center: field.center,
        geometry: field.geometry,
        bbox: field.bbox,
        fieldPoints: field.fieldPoints,
        lastStats: field.lastStats,
        scans: field.scans || [],
        updatedAt: field.updatedAt,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load saved fields" });
  }
};

const saveField = async (req, res) => {
  try {
    const { fieldId, name, locationLabel, center, geometry, bbox, fieldPoints, lastStats } = req.body;

    if (!name || !geometry || !bbox || !Array.isArray(fieldPoints) || fieldPoints.length < 3 || !center) {
      return res.status(400).json({ error: "Field name, geometry, bbox, center, and at least 3 points are required" });
    }

    const payload = {
      userId: getUserId(req),
      name: name.trim(),
      locationLabel: locationLabel?.trim() || "",
      center,
      geometry,
      bbox,
      fieldPoints,
      lastStats: lastStats || null,
    };

    let field;

    if (fieldId) {
      field = await NDVIField.findOneAndUpdate(
        { _id: fieldId, userId: getUserId(req) },
        payload,
        { new: true }
      );

      if (!field) {
        return res.status(404).json({ error: "Saved field not found" });
      }
    } else {
      field = await NDVIField.create(payload);
    }

    return res.status(fieldId ? 200 : 201).json({ field });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to save field" });
  }
};

const saveFieldScan = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { stats } = req.body;

    if (!stats?.health || !stats?.insights) {
      return res.status(400).json({ error: "Valid stats payload is required" });
    }

    const field = await NDVIField.findOne({ _id: fieldId, userId: getUserId(req) });

    if (!field) {
      return res.status(404).json({ error: "Saved field not found" });
    }

    field.lastStats = stats;
    field.scans.push({
      healthScore: stats.health.score,
      healthStatus: stats.health.status,
      riskLevel: stats.health.risk,
      meanNdvi: stats.meanNdvi,
      minNdvi: stats.minNdvi,
      maxNdvi: stats.maxNdvi,
      coveragePercent: stats.insights.coveragePercent,
      uniformityScore: stats.insights.uniformityScore,
      urgency: stats.insights.urgency,
    });

    if (field.scans.length > 20) {
      field.scans = field.scans.slice(-20);
    }

    await field.save();

    return res.json({ field });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to save NDVI scan history" });
  }
};

const getFieldHistory = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const field = await NDVIField.findOne({ _id: fieldId, userId: getUserId(req) }).lean();

    if (!field) {
      return res.status(404).json({ error: "Saved field not found" });
    }

    return res.json({
      field: {
        _id: field._id,
        name: field.name,
        scans: field.scans || [],
        lastStats: field.lastStats || null,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load field history" });
  }
};

module.exports = {
  getNDVIImage,
  getNDVIStats,
  listSavedFields,
  saveField,
  saveFieldScan,
  getFieldHistory,
};
