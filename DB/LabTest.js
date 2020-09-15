const validator = require('validator');
const mongoose = require('mongoose');

// medicineName, companyName, price

const labtest = new mongoose.Schema({
    testName: {
        type: String,
        required: true,
    },
    sampleType: {   //blood, urine etch
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
    },
    newimage:
    {
      data: Buffer,
      contentType: String
    },
    description: {
        type: String,
    }
});


const LabTest = mongoose.model('labtest', labtest);

module.exports = LabTest;


