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
    patientAddres: {
        type: String,
    },
    patientPIN: {
        type: String,
    },
    disease: {
        type: String,
    },
    diseaseAge: {
        type: String, // doctor id
    },
    doctorID: {
        type: String,
    },
    doctorName: {
        type: String,
    },
    appointmentType: {
        type: String,
        default: 'HomeVisit'  // 'HomeVisit' or 'Online'
    },
    appointmentDate: {
        type: String
    },
    isVisitCompleted: {
        type: Boolean,  // save only from VisitCompletionIntimation UI
        default: false
    },
    isPharmacyProvided: {
        type: Boolean,  // save only from PharmacistVisitCompleteIntimation UI
        default: false
    },

});


const Appointment = mongoose.model('appointment', appointment);

module.exports = Appointment;
