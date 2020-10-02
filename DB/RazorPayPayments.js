

const validator = require('validator');
const mongoose = require('mongoose');

//paymentTypeEnumKey: ....paymentTypeEnumValue: ....localUIOrderID: ....patientEmail

const razorpayPayments = new mongoose.Schema({
    // Below 4 [paymentTypeEnumKey, paymentTypeEnumValue, localUIOrderID, patientEmail] will come from local req data
    paymentTypeEnumKey: {
        type: Number,
        required: true,
        default: 1
    },
    paymentTypeEnumValue: {
        type: String,
        required: true,
    },
    localUIOrderID: {
        type: String,
        required: true,
    },
    patientEmail: {
        type: String,
        //unique: true, not required for this case
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' })
            }
        }
    },   
   
    // Below data will come from [RazorPay own API] -  GET /payments/:id 
    id: {
        type: String,
        required: true
    },
    entity: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true,
        default: null
    },
    invoice_id: {
        type: String,
        default: null
    },
    international: {
        type: Boolean,
        required: true,
        default: false
    },
    method: {
        type: String,
        required: true
    },
    amount_refunded: {
        type: Number,
        required: true,
        default: 0
    }, 
    refund_status: {
        type: String,
        default: null
    },
    captured: {
        type: Boolean,
        required: true,
        default: false
    },
    description: {
        type: String,
        default: false
    },
    card_id: {
        type: String, 
    },
    bank: {
        type: String, 
        required: true
    },
    wallet: {
        type: String, 
        default: null
    },
    vpa: {
        type: String, 
        default: null
    },
    email: {
        type: String, 
        required: true
    },
    contact: {
        type: String, 
        required: true
    },
    notes: {
        type: Array,
        required: true,
        default: []
    },
    fee: {
        type: Number,
        required: true,
        default: null
    },
    tax: {
        type: Number,
        required: true,
        default: null
    },
    error_code: {
        type: Number,
        default: null
    },
    error_description: {
        type: String,
        default: null
    },
    created_at: {
        type: Number,
        required: true
    }
   
});


const RazorpayPayments = mongoose.model('razorpayPayments', razorpayPayments);

module.exports = RazorpayPayments;
