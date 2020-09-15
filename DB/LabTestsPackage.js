const validator = require('validator');
const mongoose = require('mongoose');

//fields:patient name,patientmobno,patientadd,patientpin,diseas,diseasduration,
//doctorlist,doctorid(for save),iscompletedvisit(save only from visitfor all popup)

const labtestspackage = new mongoose.Schema({
    packageNname: {
        type: String,
        required: true,
        trim: true
    },
    testsData: [{
        testID: String,
        testname: String
    }],
    packageAmount: {
        type: Number,
        required: true
    },
    newimage:
    {
      data: Buffer,
      contentType: String
    },
    description: {
        type: String,
    }

});


const LabTestsPackage = mongoose.model('labtestspackage', labtestspackage);

module.exports = LabTestsPackage;
