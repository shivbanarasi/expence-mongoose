const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String, 
    required:true
  },
  email:{
    type:String ,
    required:true
  },
  password:{
   type :String,
   required:true
  },
  payment:{
    type:String,
    default:'no'
},
total:{
  type:Number,
  default:0,
}
  
});

module.exports = mongoose.model('User', productSchema);
