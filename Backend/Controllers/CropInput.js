const mongoose = require('mongoose');
const CropInput = require('../Models/CropInput');

const createCropInput = async (req, res) => {
    const body = req.body;
    if(!body.location || !body.soilType || !body.season || !body.irrigationType) {
        return res.status(400).json({ error: "Required fields are missing" });
    }
    try {
        const newCropInput = new CropInput({
            location: body.location,    
            soilType: body.soilType,
            season: body.season,
            irrigationType: body.irrigationType
        });
        await newCropInput.save();
        res.status(201).json({ message: "Crop input created successfully", cropInput: newCropInput });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
module.exports = {
    createCropInput
};
