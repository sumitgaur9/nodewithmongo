const mongoose = require('mongoose');

var Item = new mongoose.Schema(
    // { img: 
    //     { data: Buffer, contentType: String }
    // }
    { image: String
    }
    
  );
//   var Items = mongoose.model('Clothes',Item);
  var Items = mongoose.model('Item',Item);
 
  module.exports = Items;
  