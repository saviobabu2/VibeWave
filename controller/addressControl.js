const mongoose = require("mongoose");
const Address = require("../model/addressModel");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");



const getAllAddress = asyncHandler(async (req, res) => {
  const user = req.session.user;

  if (!user) {
    // Handle the case where user is not in the session
    console.log('User not found in session');
    return res.redirect('/login'); // Redirect to login or handle it appropriately
  }

  const address = await Address.find({ user_id: user._id });

  res.render("./user/pages/address", { address, account: true, user });
});


const addAddressPage = asyncHandler(async (req, res) => {
  const user = req.session.user;
  console.log(req.session.user._id);
  // const address = await Address.find({ user_id: req.session.user_id });
  res.render("user/pages/addAddress", { user });
});

//POST request for storing new address
const newAddress = asyncHandler(async (req, res) => {
  req.body.user_id = req.session.user._id;
  const newAddress = await Address.create(req.body);
  if (newAddress) {
    console.log(newAddress);
    res.redirect("/address");
  } else {
    throw new Error();
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
