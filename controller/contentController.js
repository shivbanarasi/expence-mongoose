const express=require('express')
const User=require('../models/user');
const Razorpay = require('razorpay');
const crypto = require("crypto");
const Expence=require('../models/expence');
const Payment=require('../models/payment')
const path=require('path');
require('dotenv').config()


exports.addexpence=async(req,res)=>{
    const{dis,amount,cat}=req.body
    const userId=req.user.id;
    console.log('hello',userId)
    const response=await Expence.create({
        userId:userId,
        amount:amount,
        discription:dis,
        category:cat
    })    
      if(response) {
        total(userId)
        console.log('exp added');
        res.setHeader('Content-Security-Policy',"script-src-elem 'self' https://cdn.jsdelivr.net/ ")     
      res.status(201).json({massage:'exp added successfully'})
    }
        
    
}

exports.getdata=async(req,res,next)=>{
    Expence.find({userId:req.user.id})

    .then((responce)=>{
            console.log(responce)
            res.status(200).json(responce)
        })   
}


exports.deleteExp=async(req,res)=>{
    const id =req.params.id;
    console.log(id)
      const data=await Expence.findOne({
        _id:id
     });
     console.log(data)
    const userId=data.userId;
     
     const response=await Expence.findOneAndDelete({_id:id})
    if(response){   
    total(userId);
    res.status(200).json({massage:'deleted'})
}    
}

exports.payment=async(req,res)=>{
    const userId=req.user.id;
    console.log('59',userId)
    const amount=2500;
    var instance=new Razorpay({key_id:process.env.RKEY_ID,key_secret:process.env.RKEY_SECRET})
    var options={
        amount:amount,
        currency:"INR",
        receipt:"rcpt"
    }
    instance.orders.create(options, function(err, order) {
        console.log('68',order);
       console.log("69",order.id);
       res.status(201).json({
        success:true,
        amount,
        order,
        userId,
        key_id:process.env.RKEY_ID
      })
      });
    }
     
      
    
    
    exports.paymentVerify=async(req,res)=>{
        const id=req.params.id;
        console.log("85",id);
        const{razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body
    
        let body=razorpay_order_id + "|" + razorpay_payment_id;
       console.log(body)
         
         var expectedSignature = crypto
         .createHmac('sha256', process.env.RKEY_SECRET)
         .update(body.toString())
         .digest('hex');
         
         const verifyPayment=expectedSignature===razorpay_signature;
         if(verifyPayment){
          const response=await Payment.create({
            userId:id,
            orderId:razorpay_order_id,
            paymentId:razorpay_payment_id,
            sign:razorpay_signature,

          })
          User.updateOne({_id:id},{$set:{payment:'success'}})
          .then(result=>{
            console.log('107',result)
          })
          res.redirect(`http://localhost:3000/frontend/display.html`)
         }
        
            // res.status(200).json({
            //     success:true
            // });
         }
          
exports.getuser=(req,res)=>{
    const id=req.user.id;
    console.log(id)
    User.find({_id:id})
    .then(response=>{
        //console.log(response)
        res.status(200).json({response})
    })
}

const total=async(userId)=>{
    let to=0;
    const data=await Expence.find({userId:userId});
    
    for(let amount of data){
        console.log(amount.amount)
        to+=amount.amount;
    }
    console.log('132',to)
    User.updateOne({_id:userId},{$set:{total:to}})
    .then(result=>{console.log(result)})

}

exports.showleaderboard=async(req,res)=>{

    const response=await User.find({}).sort({total:'asc'});
    if(response){
        console.log(response)
        res.status(200).json({response})
    }
    
}

exports.download=async(req,res)=>{
    const id=req.user.id;
    const response=await Expence.findAll({
        where:{
            UserId:id
        }
    })
    console.log(response)
        const datae=JSON.stringify(response);
        const filename=`${id}expence/${new Date}.txt`;
        const BUCKET_NAME=process.env.BUCKET_NAME;
        const IAM_USER_KEY=process.env.IAM_USER_KEY;
        const IAM_USER_SECRET=process.env.IAM_USER_SECRET;
    
        let s3bucket=new AWS.S3({
            accessKeyId:IAM_USER_KEY,
            secretAccessKey:IAM_USER_SECRET,
            bucket:BUCKET_NAME
        })
    
        s3bucket.createBucket(()=>{
            var params={
                Bucket:BUCKET_NAME,
                Key:filename,
                Body:datae,
                ACL:'public-read'
            }
           
                s3bucket.upload(params,(err,s3response)=>{
                    if(err){
                        console.log('something went wrong',err)
                       
                    }else{
                        console.log('success',s3response.Location)
                      const fileURL=s3response.Location;
                      return fileURL
}
                })
            })
        }