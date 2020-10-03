const validator = require('validator');
const mongoose = require('mongoose');

// patientname,doctorname,medicinename,pharmacy people contact no

const pharmacistvisticompleteintimation = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    appointmentId: {
        type: String,
        required: true,
    },
    medicinesData: [{
        medicineID: String,
        medicineName: String,
        medicinePricePerUnit: Number,
        medicineQty: Number,
        medicineTotPrice: String,
    }],
    price: {
        type: Number,
        required: true,
    },
    doctorName: {
        type: String,
    }, 
    doctorID: {
        type: String,
        required: true,
    },
    pharmacyPersonContactNo: {
        type: String
    }


});


const PharmacistVistiCompleteIntimation = mongoose.model('pharmacistvisticompleteintimation', pharmacistvisticompleteintimation);

module.exports = PharmacistVistiCompleteIntimation;
