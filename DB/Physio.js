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
    image: {
        type: String,
    },
    experties: {
        type: String,
        required: true,
    },
    phoneno: {
        type: String,
    },
    timeAvailablity: {
        type: String,
    },
    charges: {
        type: Number,
        required: true,
    },
    area: {
        type: String,
    },
    qualification: {
        type: String,
    },

});


const Physio = mongoose.model('physio', physio);

module.exports = Physio;
