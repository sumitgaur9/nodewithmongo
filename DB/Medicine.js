const validator = require('validator');
const mongoose = require('mongoose');

// medicineName, 

const medicine = new mongoose.Schema({
    medicineName: {
        type: String,
        required: true,
    }
});


const Medicine = mongoose.model('medicine', medicine);

module.exports = Medicine;


