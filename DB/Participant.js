const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const participant = new mongoose.Schema({
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
    phoneno: {
        type: String,
        required: true
    },
    password: {
      type: String,
      required: true,
      minLength: 7
    },
    role: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
    },
    inActive: {
      type: Boolean,
      default: false,
    },
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }]
  
  });
  
  participant.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
    }
    next()
  })
  
  participant.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    //const token = jwt.sign({_id: user._id}, "WinterIsComingGOT2019")
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
  }
  
  participant.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await Participant.findOne({ email })
    if (!user) {
      //throw new Error({ error: 'Invalid login credentials' })
      return false;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
     // throw new Error({ error: 'Invalid login credentials' })
     return false;
    }
    return user
  }
  
 
  const Participant = mongoose.model('participant', participant);

  module.exports = Participant;
  