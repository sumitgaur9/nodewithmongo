const validator = require('validator');
const mongoose = require('mongoose');

// name,email,image,experties(textarea),phoneno,time(availability),charges,area,qualification

const physio = new mongoose.Schema({
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
    },
    newimage:
    {
      data: Buffer,
      contentType: String
    },
    phoneno: {
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
    }

});


const Physio = mongoose.model('physio', physio);

module.exports = Physio;
