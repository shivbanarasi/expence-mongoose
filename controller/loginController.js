const User=require('../models/user');
const Forgetpass=require('../models/forgetpass')
const bcrypt=require('bcrypt')
const express=require('express');
const route=express.Router();
const resetpass=require('../controller/loginController')
const path=require('path');
const Sib=require('sib-api-v3-sdk')
const jwt=require('jsonwebtoken');
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');


function generateExessToken(id){
  return jwt.sign({userId:id},'totototo')
}

exports.loginuser=(req,res)=>{
    const {email,password}=req.body;
    console.log(password,email)
     User.find({email:email })
  .then((loginuser)=>{
    console.log(loginuser[0].email);
    // if(i.email===email){
       console.log(loginuser[0].password)
       bcrypt.compare(password, loginuser[0].password, function(err, result) {
         
         if(result==true){
           console.log('password matched')
//   
res.setHeader('Content-Security-Policy',"script-src-elem 'self' https://cdn.jsdelivr.net/ ")         
res.status(201).json({massage:'user logged in successfully',token:generateExessToken(loginuser[0].id)})
              
}else{
console.log('password does not match')
res.sendStatus(404)
}
})     
    })
    .catch((err)=>{
      res.sendStatus(404)
    })
     
       
          }
         
        
      
      
exports.resetpassword=async(req,res)=>{
  const id=uuidv4();
  const email=req.body.email
  const UserId=req.user.id;
 Forgetpass.create({
  Id:id,
  email:email,
  userId:UserId,
  isActive:true
 })

  const client=Sib.ApiClient.instance
  const apiKey=client.authentications['api-key']
  apiKey.apiKey=process.env.API_KEY
  const transEmailApi=new Sib.TransactionalEmailsApi()

  
  const sender={
      email:'shivbanarasi0542@gmail.com',
  }
  const receiver=[
      {
      email:email
  }
]

  transEmailApi.sendTransacEmail({
      sender,
      to: receiver,
      subject:'change your password',
      textContent:'here is your link to change your password',
      htmlContent:`<a href="http://localhost:3000/frontend/resetpass.html">link to reset password</a>`
  })
  .then(console.log)
  .catch(console.log)
  res.status(200).json({massage:'link send to email sucessfully'}) 
}


exports.setpass=async(req,res)=>{
  const da=req.body;
  console.log(da)
  const data=await User.find({email:da.email})
  console.log(data)
  
      bcrypt.hash(da.password,10,async(err,password)=>{
      const res=User.updateOne({_id},
        {$set:{password:password }
      })
      Forgetpass.updateOne({ userId:id},{$set:{isActive:false}})
  
  console.log('password change')
  res.setHeader('Content-Security-Policy',"script-src-elem 'self' https://cdn.jsdelivr.net/ ")     
  res.status(200).json({massage:'password changed sucessfully'})
})    
}


