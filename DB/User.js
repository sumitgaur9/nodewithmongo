const mongoose = require('mongoose');

const user = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  }
});

const participant = new mongoose.Schema({
  fullName: {
    type: String
  },
  email: {
    type: String
  },
  mobile: {
    type: String
  },
  role:{
    type: Number,
  },
  password: {
    type: String
  },
  confirmpassword: {
    type: String
  }
  
});

module.exports = User = mongoose.model('user', user);
module.exports = Participant = mongoose.model('participant', participant);
