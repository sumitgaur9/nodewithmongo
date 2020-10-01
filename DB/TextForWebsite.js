const mongoose = require('mongoose');

var TextForWebsite = new mongoose.Schema(
  {
    textData:
    {
        type: String,
        required: true,
    },
    locationEnum: {
        type: Number,
        required: true,
        unique: true,
    },
  }

);

var TextForWebsite = mongoose.model('TextForWebsite',TextForWebsite);
 
module.exports = TextForWebsite;
  