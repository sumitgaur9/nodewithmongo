const validator = require('validator');
const mongoose = require('mongoose');

// patient name,contact no,medicine name

const patientmedicineforhomedelivery = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
        trim: true
    },     
    patientID: {
        type: String,
        required: true,
    },     
    appointmentID: {
        type: String,
        required: true,
    },
    medicinesData: [{
        medicinesdataArrayForFixTimeSlot: [{
            medicineID: String,
            medicineName: String,
        }],        
        medicineSNo: Number,
        medicineScheduleTime: String,
        medicineScheduleDate: String,
        processInfo: String,
    }],
    // medicineID: {
    //     type: String,
    //     required: true,
    // },
    // medicineName: {
    //     type: String,
    //     required: true,
    // },
    doctorID: {
        type: String,
        required: true,  // not to show on UI
    },
    doctorName: {
        type: String,
        required: true
    },
    testsData: [{
        testID: String,
        testname: String
    }],
    pharmacistID: {
        type: String,
        required: true,
    },
    pharmacistName: {
        type: String,
        required: true,
    },
    patientContactNo: {
        type: String
    },
    patientAddress: {
        type: String
    },
    patientPIN: {
        type: String
    },
    isPharmacyRequested: {
        type: Boolean,  // save only from PharmacyReqForHomeDel UI
        default: false
    },
    isPharmacyProvided: {
        type: Boolean,  // save only from PharmacistVisitCompleteIntimation UI
        default: false
    },

});


const PatientMedicineForHomeDelivery = mongoose.model('patientmedicineforhomedelivery', patientmedicineforhomedelivery);

module.exports = PatientMedicineForHomeDelivery;
