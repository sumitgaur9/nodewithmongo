const validator = require('validator');
const mongoose = require('mongoose');

// medicineName, companyName, price

const medicine = new mongoose.Schema({
    medicineName: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
});


const Medicine = mongoose.model('medicine', medicine);

module.exports = Medicine;


