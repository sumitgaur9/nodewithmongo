const validator = require('validator');
const mongoose = require('mongoose');



const cartDetails = new mongoose.Schema({
    itemID: {
        type: String,
        required: true,
    },
    itemName: String,
    // newimage:
    // {
    //     data: Buffer,
    //     contentType: String
    // },
    companyName: {
        type: String,
        default: '',
    },
    price: Number,
    qty: Number,
    paymentTypeEnumKey: Number,
    paymentTypeEnumValue: String,
    userId: {
        type: String,
        required: true,
    }
});


const CartDetails = mongoose.model('cartDetails', cartDetails);

module.exports = CartDetails;
