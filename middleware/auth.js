const jwt=require('jsonwebtoken');
const User=require('../models/user');
require('dotenv').config()

const authenticate=(req,res,next)=>{
    try{
        const token=req.header("Authorization");
        console.log('token=',token);
        const user=jwt.verify(token,'totototo');
        console.log(user)
        User.findOne({_id:user.userId}).then(user=>{
           //console.log(JSON.stringify(user));
            req.user=user;
            next();
        })
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false})
    }
} 
module.exports={authenticate}