const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  userId: {
    type: String, 
    required:false
  },
  amount:Number,
  discription:String,
  category:String
});

module.exports = mongoose.model('Expence', productSchema);
