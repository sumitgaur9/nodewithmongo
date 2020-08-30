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
    participantID: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    experties: {
        type: String,
        default: '',
       // required: true,
    },
    phoneno: {
        type: String,
    },
    timeAvailablity: {
        type: String,
    },
    description: {
        type: String,
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
