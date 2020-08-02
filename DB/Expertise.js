const validator = require('validator');
const mongoose = require('mongoose');

// diseaseName

const expertise = new mongoose.Schema({
    diseaseName: {
        type: String,
        required: true,
        trim: true
    }
});


const Expertise = mongoose.model('expertise', expertise);

module.exports = Expertise;


