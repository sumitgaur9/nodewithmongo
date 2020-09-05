const mongoose = require('mongoose');

var ItemForImageByteArray = new mongoose.Schema(
  {
    image:
    {
      data: Buffer,
      contentType: String
    }
  }
  // { image: String
  // }

);
//   var Items = mongoose.model('Clothes',Item);
  var ItemForImageByteArray = mongoose.model('ItemForImageByteArray',ItemForImageByteArray);
 
  module.exports = ItemForImageByteArray;
  