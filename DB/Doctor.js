const validator = require('validator');
const mongoose = require('mongoose');

// name,email,image,experties(textarea),phoneno,time(availability),charges,area,qualification

const doctor = new mongoose.Schema({
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
    gender: {
        type: Number,
        default: 1  //1-Male, 2-Female
    },
    participantID: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    newimage:
    {
      data: Buffer,
      contentType: String
    },
    experties: {
        type: String,
        default: '',
       // required: true,
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
    charges: {
        type: Number,
        default: 0,
       // required: true,
    },
    area: {
        type: String,
        default: '',
    },
    qualification: {
        type: String,
        default: '',
    },

});


const Doctor = mongoose.model('doctor', doctor);

module.exports = Doctor;
