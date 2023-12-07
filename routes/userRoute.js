const express = require('express');
const ejs = require('ejs');
const path = require('path');
 const bodyParser = require('body-parser');
const user_route = express();
const userController = require('../controller/userController');
const addressController = require('../controller/addressControl')
const userAuth = require('../middleware/userAuth');
const mongoose = require('mongoose');
const config=require('../config/config');
const  session=require('express-session');




user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));




user_route.use(session({
  secret:config.sessionSecret,
  resave: false,
  saveUninitialized: false
}));



user_route.get('/',userController.loadlandingpage);
user_route.get('/login',userController.loadloginpage);
user_route.post('/login',userController.login);


user_route.get('/signup',userController.loadregistration);
user_route.post('/signup',userController. signUP);


user_route.get('/logout',userController.logout);

user_route.get('/profile',userController.loadprofile);




user_route.get('/otp',userController.sendOTPpage);
user_route.post('/otp',userController.verifyOTP);

//user_route.get('/reSendOTP', userController.reSendOTP);

//userRoute.post('/reSendOTP', usercontroller.verifyResendOTP);


user_route.get('/about',userController.loadaboutpage)

user_route.get('/contact',userController.loadcontactpage);

user_route.get('/home',userController.loadHomePage);

user_route.get('/checkout',userController.loadcheckoutPage);


user_route.get('/product',userController.loadproductdetailspage);

user_route.get('/productList',userController.productList);


user_route.get('/editUser',userController.editUserDetailspage);
user_route.post('/editUser',userController.editUserDetails);


//for cart
user_route.get('/shopCart', userController.loadshopcartpage);
user_route.post('/shopCart', userController.addToCart);






// <!--AddressManagment-->
user_route.get('/address',addressController.getAllAddress);
user_route.get('/addAddress',  addressController.addAddressPage);
user_route.post('/addAddress',  addressController.newAddress)



module.exports = user_route;


