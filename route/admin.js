const express=require('express');
const route=express.Router();
const usercontroller=require('../controller/userController')
const loginController=require('../controller/loginController')
const contentController=require('../controller/contentController')
const usrauthentication=require('../middleware/auth')

route.post('/frontend/signup.html',usercontroller.adduser)

route.post('/frontend/login.html',loginController.loginuser)

route.post('/frontend/display.html',usrauthentication.authenticate,contentController.addexpence)

route.get('/frontend/display',usrauthentication.authenticate,contentController.getdata)

route.get('/frontend/display/:id',contentController.deleteExp)

route.post('/payment',usrauthentication.authenticate,contentController.payment);

route.post('/payment/verify/:id',contentController.paymentVerify)

route.get('/frontend/user',usrauthentication.authenticate,contentController.getuser)

route.get('/leaderboard',contentController.showleaderboard)

route.get('/download',usrauthentication.authenticate,contentController.download)

route.post('/forgetpass',usrauthentication.authenticate,loginController.resetpassword)

route.post('/resetpass',loginController.setpass)

module.exports=route