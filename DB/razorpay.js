let Razorpay = require('razorpay');

const RazorpayConfig = {
    key_id: 'rzp_test_S6Oc7OAUlNhPz3',
    key_secret: '9oad02hYU3YABqDfrd3msZfW',
}

var instance = new Razorpay(RazorpayConfig);

module.exports.config = RazorpayConfig;
module.exports.instance = instance;