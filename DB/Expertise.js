const validator = require('validator');
const mongoose = require('mongoose');

// diseaseName

const expertise = new mongoose.Schema({
    expertiseName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});


const Expertise = mongoose.model('expertise', expertise);

module.exports = Expertise;


