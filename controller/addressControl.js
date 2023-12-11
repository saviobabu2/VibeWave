const mongoose = require("mongoose");
const Address = require("../model/addressModel");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");








const getAllAddress = asyncHandler(async (req, res) => {
  const user = req.session.user;


  const address = await Address.find({ user: user._id });

  res.render("./user/pages/address", { address, account: true, user });
});









const addAddressPage = asyncHandler(async (req, res) => {
  try {
  
   // const user = req.session.user;
    const userId = req.session.user._id;
   
    const userAddressList = await Address.findOne({ user: userId }).populate('list.email');

    if (!userAddressList || userAddressList.list.length === 0) {
    
      return res.render('./user/pages/addAddress', { message: 'Your ADDRESS LIST is empty' });
    } else {
      res.render('user/pages/addAddress', { userAddressList });
    }
  } catch (error) {
    console.error('Error loading add address page:', error);
    // Handle the error appropriately
  }
});

    





const newAddress = asyncHandler(async (req, res) => {
  try {
   
    const userId = req.session.user._id; // Corrected from req.session._id

    const userEmail = req.session.user.email;

    const { user_name, phone, pincode, address, town, state } = req.body;



    const newAddressData = {
      user: userId,
      list: [
        {
          email: userEmail,
          user_name,
          phone,
          pincode,
          address,
          town,
          state,
        },
      ],
    };

    const newAddress = await Address.create(newAddressData);

    if (newAddress) {
      console.log('New address added:', newAddress);
      res.redirect('/address');
    } else {
      throw new Error('Error creating new address');
    }
  } catch (error) {
    console.error('Error creating new address:', error);
    // Handle the error appropriately
  }
});







module.exports = {
  getAllAddress,
  addAddressPage,
  newAddress,
  // editAddressPage,
  // editAddress,
  // deleteAddress,
};
