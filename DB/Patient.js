const validator = require('validator');
const mongoose = require('mongoose');

// name,email,image,phoneno,disease,requireddoctor,address,prefferedtime,

const patient = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' })
            }
        }
    },
    participantID: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    newimage:
    {
      data: Buffer,
      contentType: String
    },
    disease: {
        type: String
    }, 
    phoneno: {
        type: String,
    },
    description: {
      type: String,
    },
    inActive: {
        type: Boolean,
        default: false,
    },
    address: {
        type: String,
    },
    qualification: {
        type: String,
    },

});


const Patient = mongoose.model('patient', patient);

module.exports = Patient;
