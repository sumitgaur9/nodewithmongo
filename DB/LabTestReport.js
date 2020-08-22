const validator = require('validator');
const mongoose = require('mongoose');

// booklabtestID, reportData (pdf), labtechnicianId, labtechnicianName, reportGenerationDate) 

const labtestreport = new mongoose.Schema({
    reportData: {
        type: String,
        required: true,
        default: '',
    },
    bookLabTestId: {
        type: String,
        required: true,   
    },
    labTechnicanID: {
        type: String,
        required: true,
    },
    labTechnicanName: {
        type: String,
        required: true,
    },
    reportGenerationDate: {
        type: String,
        //required: true,
    },

});


const LabTestReport = mongoose.model('labtestreport', labtestreport);

module.exports = LabTestReport;
