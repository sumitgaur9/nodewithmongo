const mongoose = require('mongoose');

var ItemForWebsite = new mongoose.Schema(
  {
    image:
    {
      data: Buffer,
      contentType: String
    },
    locationEnum: {
        type: Number,
        required: true,
        unique: true,
    },
  }
  // { image: String
  // }

);
//   var Items = mongoose.model('Clothes',Item);
  var ItemForWebsite = mongoose.model('ItemForWebsite',ItemForWebsite);
 
  module.exports = ItemForWebsite;
  