const validator = require('validator');
const mongoose = require('mongoose');

//fields:patient name,patientmobno,patientadd,patientpin,diseas,diseasduration,
//doctorlist,doctorid(for save),iscompletedvisit(save only from visitfor all popup)

const booklabtest = new mongoose.Schema({
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
        unique: true,
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
    testType: {
        type: String,
        required: true
    },
    packageID: {
        type: String,
    },
    packageName: {
        type: String,
    },
    testsData: [{
        testID: String,
        testname: String
    }],
    isReportGenerated: {
        type: Boolean,  // save only from VisitCompletionIntimation UI
        default: false
    }

});


const BookLabTest = mongoose.model('booklabtest', booklabtest);

module.exports = BookLabTest;
