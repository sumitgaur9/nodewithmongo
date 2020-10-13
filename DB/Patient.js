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
    gender: {
        type: Number,
        default: 1  //1-Male, 2-Female
    },
    age: {
        type: Number,
        default: 18  
    },
    weight: {
        type: Number, 
        default: 60  
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
    description: {
      type: String,
    },
    inActive: {
        type: Boolean,
        default: false,
    },
    address: {
        type: String,
    }
});


const Patient = mongoose.model('patient', patient);

module.exports = Patient;
