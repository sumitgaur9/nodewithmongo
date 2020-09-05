const validator = require('validator');
const mongoose = require('mongoose');


// name,email, participantID, image, phoneno

const admin = new mongoose.Schema({
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
    newimage:
    {
      data: Buffer,
      contentType: String
    },
    description: {
      type: String,
    },
    phoneno: {
        type: String,
    }
    
});


const Admin = mongoose.model('admin', admin);

module.exports = Admin;
