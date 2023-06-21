const User=require('../models/user');
const bcrypt=require('bcrypt')
const express=require('express')
const index=express()
const bodyParser=require('body-parser');

index.use(bodyParser.json())

exports.adduser=(req,res)=>{
    // const email=req.body.email;
    // const name=req.body.name;
    // const phone=req.body.phone;
    // const password=req.body.password;
    // const conpass=req.body.conpass;
    // console.log(email);

    const data=req.body
    console.log(data)
    //res.sendStatus(200)
        bcrypt.hash(data.password,10,async(err,password)=>{
            User.create({
                name:data.name,
                email:data.email,
                password:password
               })
               .then(()=>{
                
                    console.log('user added sucessfully')
                    res.sendStatus(201)
                    
                   // res.sendStatus(200).json({massage:response,Status:200})
                
               }).catch(err=>{
                console.log(err);
                res.sendStatus(500)
               })
               
            })
    }
   
