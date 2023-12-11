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



user_route.get('/',userAuth.isLogout,userController.loadlandingpage);
user_route.get('/login',userAuth.isLogout,userController.loadloginpage);
user_route.post('/login',userController.login);


user_route.get('/signup',userAuth.isLogout,userController.loadregistration);
user_route.post('/signup',userController. signUP);


user_route.get('/logout',userController.logout);

user_route.get('/profile',userAuth.isLogin,userController.loadprofile);




user_route.get('/otp',userController.sendOTPpage);
user_route.post('/otp',userController.verifyOTP);

//user_route.get('/reSendOTP', userController.reSendOTP);

//userRoute.post('/reSendOTP', usercontroller.verifyResendOTP);


user_route.get('/about',userController.loadaboutpage)

user_route.get('/contact',userController.loadcontactpage);

user_route.get('/home',userAuth.isLogin,userController.loadHomePage);



user_route.get('/product',userAuth.isLogin,userController.loadproductdetailspage);

user_route.get('/productList',userAuth.isLogin,userController.productList);


user_route.get('/editUser',userAuth.isLogin,userController.editUserDetailspage);
user_route.post('/editUser',userController.editUserDetails);


//for cart
user_route.get('/shopCart',userAuth.isLogin, userController.loadshopcartpage);
user_route.post('/shopCart', userController.addToCart);
user_route.get('/removeOneItem/:productId',userAuth.isLogin, userController.removeOneItem);
user_route.put('/updateQuantity/:productId', userController.updateQuantity);




// <!--AddressManagment-->
user_route.get('/address',userAuth.isLogin,addressController.getAllAddress);
user_route.get('/addAddress', userAuth.isLogin, addressController.addAddressPage);
user_route.post('/addAddress',  addressController.newAddress)


// // <!--for checkout-->
// user_route.get('/checkout',userAuth.isLogin, userController.loadCheckoutPage);


module.exports = user_route;


