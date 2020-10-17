const validator = require('validator');
const mongoose = require('mongoose');

// medicineName, companyName, price

const medicine = new mongoose.Schema({
    medicineName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
    },
    mfgDate: {
        type: String
    },
    expDate: {
        type: String
    },
    isPrescriptionRequired: {
        type: Boolean,
        default: false
    },
    isExpired: {
        type: Boolean,
        default: false
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
      default: ''
    }
});


const Medicine = mongoose.model('medicine', medicine);

module.exports = Medicine;


