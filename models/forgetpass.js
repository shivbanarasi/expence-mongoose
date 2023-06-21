const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const productSchema = new Schema({
  id:String,
  userId: {
    type: String, 
    
  },
  email:String,
  isActive:{
    type:Boolean,
    
  }
});

module.exports = mongoose.model('Forgetpass', productSchema);
