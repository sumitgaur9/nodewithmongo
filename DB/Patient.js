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
    image: {
        type: String,
    },
    disease: {
        type: String,
        required: true,
    },
    requiredDoctor: {
        type: String,
        required: true,
    },    
    phoneno: {
        type: String,
    },
    prefferedTime: {
        type: String,
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
