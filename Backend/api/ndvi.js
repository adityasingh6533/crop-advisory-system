const express = require("express");
const auth = require("../middleware/auth");
const {
  getNDVIImage,
  getNDVIStats,
  listSavedFields,
  saveField,
  saveFieldScan,
  getFieldHistory,
} = require("../Controllers/ndvi");

const router = express.Router();

router.post("/", getNDVIImage);
router.post("/stats", getNDVIStats);
router.get("/fields", auth, listSavedFields);
router.post("/fields", auth, saveField);
router.get("/fields/:fieldId/history", auth, getFieldHistory);
router.post("/fields/:fieldId/scans", auth, saveFieldScan);

module.exports = router;
