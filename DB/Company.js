const validator = require('validator');
const mongoose = require('mongoose');

// diseaseName

const company = new mongoose.Schema({
    expertiseName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});


const Company = mongoose.model('Company', company);

module.exports = Company;


