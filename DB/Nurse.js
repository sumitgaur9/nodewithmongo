const validator = require('validator');
const mongoose = require('mongoose');

// name,email,image,experties(textarea),phoneno,time(availability),charges,area,qualification

const nurse = new mongoose.Schema({
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
    charges: {
        type: Number,
        default: 0,
       // required: true,
    },
    description: {
      type: String,
    },
    inActive: {
        type: Boolean,
        default: false,
    },
    area: {
        type: String,
    },
    qualification: {
        type: String,
    },

});


const Nurse = mongoose.model('nurse', nurse);

module.exports = Nurse;
