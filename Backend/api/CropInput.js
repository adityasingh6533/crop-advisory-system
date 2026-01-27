const express = require('express');
const router = express.Router();
const { createCropInput } = require('../Controllers/CropInput');
router.post('/', createCropInput);

module.exports = router;
