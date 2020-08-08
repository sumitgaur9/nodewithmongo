const validator = require('validator');
const mongoose = require('mongoose');

// medicineName, companyName, price

const labtest = new mongoose.Schema({
    testName: {
        type: String,
        required: true,
    },
    sampleType: {
        type: String,
        required: true,
    },
    minSampleSize: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
});


const LabTest = mongoose.model('labtest', labtest);

module.exports = LabTest;


