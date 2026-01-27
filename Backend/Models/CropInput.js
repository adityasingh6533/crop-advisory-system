const mongoose = require('mongoose');

const CropInputSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    soilType: {
        type: String,
        required: true
    },
    season: {
        type: String,
        required: true
    },
    irrigationType: {  
        type: String,
        required: true
    }
}, { timestamps: true });

const CropInput = mongoose.model('CropInput', CropInputSchema);

module.exports = CropInput;