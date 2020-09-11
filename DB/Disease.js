const validator = require('validator');
const mongoose = require('mongoose');

// diseaseName,takeCareBy

const disease = new mongoose.Schema({
    diseaseName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    takeCareBy: {
        type: String,
        required: true
    }

});


const Disease = mongoose.model('disease', disease);

module.exports = Disease;
