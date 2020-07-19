const validator = require('validator');
const mongoose = require('mongoose');

// patientname,next visit need(selectbox:yes,no)

const visitcompleteintimation = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
        trim: true
    },  
    isNextVisitRequired: {
        type: Boolean,
        required: true,
    }

});


const VisitCompleteIntimation = mongoose.model('visitcompleteintimation', visitcompleteintimation);

module.exports = VisitCompleteIntimation;
