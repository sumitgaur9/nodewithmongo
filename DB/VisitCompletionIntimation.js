const validator = require('validator');
const mongoose = require('mongoose');

// patientname,next visit need(selectbox:yes,no)

const visitcompleteintimation = new mongoose.Schema({
    role: {
        type: Number,  //1-Doctor, 2-Nurse, 3-Physio, 
        required: true,
      },
    patientName: {
        type: String,
        required: true,
        trim: true
    },  
    isNextVisitRequired: {
        type: Boolean,
        required: true,
    },
    appointmentId: {
        type: String,
        //required: true,  //will use for doctor's appointment case , not for nurse's booklabtest case
    },
    bookLabTestId: {
        type: String,
        //required: true,   //will use for nurse's booklabtest case , not for doctor's appointment case
    }

});


const VisitCompleteIntimation = mongoose.model('visitcompleteintimation', visitcompleteintimation);

module.exports = VisitCompleteIntimation;
