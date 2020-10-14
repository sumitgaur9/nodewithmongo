const validator = require('validator');
const mongoose = require('mongoose');

//fields:patient name,patientmobno,patientadd,patientpin,diseas,diseasduration,
//doctorlist,doctorid(for save),iscompletedvisit(save only from visitfor all popup)

const appointment = new mongoose.Schema({
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
    patientMob: {
        type: String,
    },
    patientEmail: {
        type: String,
        //unique: true, not required for this case
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' })
            }
        }
    },
    patientID: {
        type: String,
        required: true
    },
    patientWeight: {
        type: Number, 
        default: 60  
    },
    patientAddres: {
        type: String,
    },
    patientPIN: {
        type: String,
    },
    diseasesData: [{
        diseasesID: String,
        diseaseName: String
    }],
    symptomsData: [{
        symptomID: String,
        symptomName: String
    }],
    illnessHistoryData: [{
        illnessID: String,
        illnessName: String
    }],
    doctorID: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    appointmentType: {
        type: String,
        default: 'HomeVisit'  // 'HomeVisit' or 'Online'
    },
    charges: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
    },
    appointmentDate: {
        type: String,
        required: true,
    },
    timeSlot: {
        type: Number,
        required: true,
    },
    paymentID: {
        type: String,
        default: '',
    },
    isPaymentDone: {
        type: Boolean,
        default: false
    },
    isVisitCompleted: {
        type: Boolean,  // save only from VisitCompletionIntimation UI
        default: false
    },
    isPharmacyProvided: {
        type: Boolean,  // save only from PharmacistVisitCompleteIntimation UI
        default: false
    }
   
});


const Appointment = mongoose.model('appointment', appointment);

module.exports = Appointment;
