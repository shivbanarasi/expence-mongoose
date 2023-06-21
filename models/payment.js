const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    userId:String,
  orderId: {
    type: String, 
  },
  paymentId:String,
  sign:String,
});

module.exports = mongoose.model('Payment', productSchema);
