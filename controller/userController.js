const mongoose = require("mongoose");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { sendOtp } = require("../utility/nodeMailer");

const { generateOTP } = require("../utility/nodeMailer");
const productModel = require("../model/productModel");
const Cart= require("../model/cartModel");



const loadlandingpage = asyncHandler(async (req, res) => {

  //console.log(req.session.user,'i am user');

if(req.session.user){
  console.log('not destroyed');

  res.redirect("/home");

}else{

  try {



    const products = await productModel.find({ isListed: true });
    res.render("./user/pages/index", { products });
  } catch (error) {
    throw new Error(error);
  }

}
 
});



const loadloginpage = async (req, res) => {
  try {
    res.render('./user/pages/login');
  } catch (error) {
    throw new Error(error);
  }
};




const loadregistration = async (req, res) => {
  try {
    const user = req.session.user;

    res.render("./user/pages/signup");
  } catch (error) {
    throw new Error(error);
  }
};





//for signup
const signUP = async (req, res) => {
  try {
    const emailCheck = req.body.email;
    const checkData = await User.findOne({ email: emailCheck });

    if (checkData) {
  
      return res.render('./user/pages/signup', { userCheck: "User already exists, please try with a new email" });
    } else {
      const userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      };

      const confirmPassword = req.body.confirmPassword;

      // Check if the password and confirm password match
      if (userData.password !== confirmPassword) {
        return res.render('./user/pages/signup', { passwordMatchError: "Password and confirm password do not match" });
      }
      

      const OTP = generateOTP(); /* otp generating */

      req.session.otpUser = { ...userData, otp: OTP };

      console.log(req.session.otpUser);

      /** otp sending ***/
      try {
        sendOtp(req.body.email, OTP, req.body.username);
        req.app.locals.otpUser = { otpUser: { ...User, otp: OTP }};
        return res.redirect('/otp' );
      } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).send('Error sending OTP');
      }
    }
  } catch (error) {
    throw new Error(error);
  }
}






//password hashing
const securePassword=async(password)=>{
  try {
    const passwordHash=await bcrypt.hash(password,10)
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
}






//sending otp page

const sendOTPpage = asyncHandler(async (req, res) => {
  try {
    const user = req.session.user_id
    userData= req.session.otpUser
    res.render('user/pages/otpVerification', { error: false, userData }); // Pass error as false initially
  } catch (error) {
    console.log(error.message);
  }
});




//verify otp
const verifyOTP = asyncHandler(async (req, res) => {
  try {

    const enteredOTP = req.body.otp;
    const email = req.session.otpUser.email;
    const storedOTP = req.session.otpUser.otp;
    const userData = req.session.otpUser;
   
  if (enteredOTP == storedOTP) {

   
    userData.password = await bcrypt.hash(userData.password, 10);
   



      // Create a new user using the User model
      const newUser = await User.create(userData);
      console.log(userData);
      delete req.app.locals.otpUser.otpUser.otp;

      console.log(newUser.id, 'User created successfully');

      res.redirect('/login');
    } else {
      const messages = 'Verification failed, please check the OTP or resend it.';
      console.log('Verification failed');
      res.render('user/pages/otpVerification', { messages, email, error: true }); // Pass error as true
    }
  } catch (error) {
    console.error(error);
    res.render('user/pages/otpVerification', { messages: 'Internal Server Error', error: true }); // Pass error as true
  }
});


// //resend otp
// const reSendOTP = async (req, res) => {

//       const OTP = generateOTP() /** otp generating **/
//       req.body.otpUser.otp = { otp: OTP };
      

//       const email = req.body.otpUser.email
//       const username = req.body.otpUser.username

//   console.log(req.body);

// // otp resending 
// try {
//   sendOtp(req.body.email, OTP, req.body.username);
//   console.log('otp is sent');
//   console.log(OTP);
//   return res.render('./user/pages/resendOtp', { email });
// } catch (error) {
//   console.error('Error sending OTP:', error);
//   return res.status(500).send('Error sending OTP');
// }

// }

// // verifying resend otp
// const verifyResendOTP = asyncHandler(async (req, res) => {
//   try {
//     console.log(req.app.locals.otpUser);
//     const enteredOTP = req.body.otp;
//     const email = req.app.locals.otpUser.email;
//     const storedOTP = req.app.locals.otpUser.otpUser.otp; 
//     const user = req.app.locals.otpUser.otpUser;

//     if (enteredOTP == storedOTP) {
//       user.password = await bcrypt.hash(user.password, 10);
//       const newUser = await User.create(user);
//       await newUser.save();
//       delete req.app.locals.otpUser.otpUser.otp;

//       res.redirect('/home');
//     } else {
//       messages = 'Verification failed, please check the OTP or resend it.';
//       console.log('verification failed');
//       res.render('user/pages/otpVerification', { messages, email });
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });


// for login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        req.session.user = {
          _id: user._id,
          username: user.username,
          email: user.email,
          
        }
        ;
        
     //req.session.id=user._id
      //  console.log('just above it');
       // console.log(req.session.user._id,'ing athi tto');

        res.redirect('/home');
      } else {
        res.render('user/pages/login', { message: "Incorrect password" });
      }
    } else {
      res.render('user/pages/login', { message: 'User not found' });
    }
  } catch (error) {
    res.render('user/pages/login', {message: 'An error occurred. Please try again.' });
  }
});







//for loading profile page
const loadprofile = async (req, res) => {
  try {
  
    const user = req.session.user;

    // it is working console.log(req.session.user);

 
    const userDetails = await User.findOne({ _id: user._id });


    res.render("./user/pages/profilepage", { user: userDetails });
  } catch (error) {
  
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};



//for loading home page
const loadHomePage = async (req, res) => {

  try {
   // console.log(req.session.user);
    const products = await productModel.find({ isListed: true });
    res.render("./user/pages/home", { products });
  } catch (error) {
    throw new Error(error);
  }
};



const loadaboutpage=async(req,res)=>{
  try {
    res.render('./user/pages/aboutUs')
  } catch (error) {
    throw new Error(error);
  }
}


const loadcontactpage=async(req,res)=>{
  try {
    res.render('./user/pages/contact')
  } catch (error) {
    throw new Error(error);
  }
}

const loadshoppage=async(req,res)=>{
  try {
    res.render('./user/pages/shop')
  } catch (error) {
    throw new Error(error);
  }
}








// for logout
const logout = async (req, res) => {
  console.log('above it');
  
  try {
    req.session.destroy();
    console.log(req.session);
    //res.end();
    res.redirect("/");
    
  } catch (error) {
    console.log(error.message);
  }
};






//for getting the details of a particilar product

const loadproductdetailspage=async(req,res)=>{
  try {
    const product= await productModel.find({ isListed
      : true });
  
 res.render('./user/pages/productdetails', { product })

  } catch (error) {
    throw new Error(error);
  }
}








//for checkoutpage

const loadcheckoutPage=async(req,res)=>{
  try {
    res.render('./user/pages/checkout')
  } catch (error) {
    throw new Error(error);
  }
}








const productList=async(req,res)=>{
  try {
   
    const product= await productModel.find({list:true});
    res.render('./user/pages/productList',{product});
  } catch (error) {
    throw new Error(error);
  }
}









const loadaddressPage=async(req,res)=>{
  try {
    const product = await addressModel.findOne({ userid :userId });
    res.render('./user/pages/address',{address})
  } catch (error) {
    throw new Error(error);
  }
}











const addToCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login if the user is not logged in
    }

    const userId = req.session.user._id;
    const { productId, quantity } = req.body;

    let userCart = await Cart.findOne({ user: userId });

    // If the user doesn't have a cart, create a new one
    if (!userCart) {
      userCart = new Cart({ user: userId, product: [] });
    }

    // Check if the product is already in the cart
    const existingProductIndex = userCart.product.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingProductIndex !== -1) {
      // If the product is already in the cart, update the quantity
      userCart.product[existingProductIndex].quantity += quantity;
    } else {
      // If the product is not in the cart, add it
      userCart.product.push({ productId, quantity });
    }

    // Save the updated cart
    await userCart.save();
    

  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).send('Internal Server Error');
  }
};












// for cart page
const loadshopcartpage = async (req, res) => {
  try {
    let message = ''; // Initialize the message variable

    if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login if the user is not logged in
    }

    const userId = req.session.user._id;
    const userCart = await Cart.findOne({ user: userId }).populate("product.productId");

    let totalPrice = 0;

    if (!userCart || userCart.product.length === 0) {
      message = 'No items in the cart';
    } else {
      userCart.product.forEach((cartItem) => {
        totalPrice += cartItem.productId.productPrice * cartItem.quantity;
        console.log(cartItem.productId.productPrice);
      });
      res.render('./user/pages/cartPage', { userCart, totalPrice });
    }

  

  } catch (error) {
    console.error('Error loading cart page:', error);
    res.status(500).send('Internal Server Error');
  }
};














//to get edit user page
const editUserDetailspage=async(req,res)=>{
  try {
    res.render('./user/pages/editUserDetails')
  } catch (error) {
    throw new Error(error);
  }
}
















//to edit user details

const editUserDetails = async (req, res) => {
  try {
    const userId = req.session.user._id; // Assuming you are passing the user ID as a parameter
    const { updateFields } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.redirect('/profile');
    }

    // Update user details based on the specified fields
    if (updateFields.username) {
      user.username = updateFields.username;
    }

    if (updateFields.email) {
      user.email = updateFields.email;
    }

    if (updateFields.password) {
      // Hash and update the password if provided
      const hashedPassword = await bcrypt.hash(updateFields.password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user details
    await user.save();

    return res.redirect('/profile'); // Redirect to profile after successful update
  } catch (error) {
    console.error('Error updating user details:', error);
    return res.redirect('/profile'); // Redirect to profile in case of an error
  }
};




 module.exports = {
 loadloginpage,
 signUP,
 securePassword,
 loadaboutpage,
 loadprofile,
 //reSendOTP,
 loadcontactpage,
 logout,
 loadshoppage,
 loadHomePage,
 sendOTPpage,
  loadregistration,
  loadHomePage,
 verifyOTP,
 loadlandingpage,
 login,
 loadshopcartpage,
 loadcheckoutPage,
 productList,
// verifyResendOTP,
 loadproductdetailspage,
 addToCart,
 editUserDetailspage,
 editUserDetails,
 loadaddressPage
 };







