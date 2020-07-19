const validator = require('validator');
const mongoose = require('mongoose');

// patient name,contact no,medicine name

const patientmedicineforhomedelivery = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
        trim: true
    },  
    medicineName: {
        type: String,
        required: true,
    },
    patientContactNo: {
        type: String
    }

});


const PatientMedicineForHomeDelivery = mongoose.model('patientmedicineforhomedelivery', patientmedicineforhomedelivery);

module.exports = PatientMedicineForHomeDelivery;
