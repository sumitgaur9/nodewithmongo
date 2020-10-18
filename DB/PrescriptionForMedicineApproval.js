const validator = require('validator');
const mongoose = require('mongoose');

// name,email,image,experties(textarea),phoneno,time(availability),charges,area,qualification

const prescriptionForMedicineApproval = new mongoose.Schema({
    medicineName: {
        type: String,
        required: true,
    },
    medicineID: {
        type: String,
        required: true,
    },
    newImage:
    {
      data: Buffer,
      contentType: String
    },
    patientNname: {
        type: String,
        required: true,
        trim: true
    },
    patientAge: {
        type: Number,
        default: 18
    },
    patientSex: {
        type: Number,
        default: 1 //1-Male, 2-Female
    },
    patientEmail: {
        type: String,
        required: true,
        trim: true
    },
    patientID: {
        type: String,
        required: true
    },
    phoneno: {
        type: String,
    },
    RequestDate: {
        type: String,
        required: true,
    },
    approvalDate: {
        type: String,
        default: ''
    },
    isPaymentDone: {
        type: Boolean,
        default: false
    },
    isPrescriptionRequestApproved: {
        type: Boolean,
        default: false
    },

});


const PrescriptionForMedicineApproval = mongoose.model('prescriptionForMedicineApproval', prescriptionForMedicineApproval);

module.exports = PrescriptionForMedicineApproval;
