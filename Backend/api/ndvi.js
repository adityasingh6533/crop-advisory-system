const express = require("express");
const { getNDVIImage } = require("../Controllers/ndvi");

const router = express.Router();

router.post("/", getNDVIImage);

module.exports = router;
