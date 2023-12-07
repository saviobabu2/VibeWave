const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');


const admin={
  ADMIN_PASSWORD:  "admin123",
ADMIN_EMAIL: "admin123@gmail.com"
};

// Load login page
const loadLogin = async (req, res) => {
  try {
    res.render('./admin/pages/acclogin', { title: 'adminLogin' });
  } catch (error) {
    throw new Error(error);
  }
};

// Load dashboard
const loadDashboard = async (req, res) => {
  try {
    console.log("inside login")
    res.render('./admin/pages/index', { title: 'Dashboard' });
  } catch (error) {
    throw new Error(error);
  }
};

// Login
const login = async (req, res) => {
  try {
   
    const email = admin.ADMIN_EMAIL;
    const password = admin.ADMIN_PASSWORD;

    const emailCheck = req.body.email;
    const user = await User.findOne({ email: emailCheck });

    if (user) {
      return res.render('./user/pages/home');
    }

    if (emailCheck === email && req.body.password === password) {
      console.log("trying for dashboard");
      return res.render('./admin/pages/index', { title: 'Dashboard' });
    } else {
      return res.render('./admin/pages/acclogin', { adminCheck: 'Invalid Credentials', title: 'adminLogin' });
    }
  } catch (error) {
    throw new Error(error);
  }
};

// User Management
const userManagement = async (req, res) => {
  try {
    const findUsers = await User.find();
    res.render('./admin/pages/userList', { users: findUsers, title: 'UserList' });
  } catch (error) {
    throw new Error(error);
  }
};

// // Search User
// const searchUser = async (req, res, next) => {
//   try {
//     const data = req.body.search;
//     const searching = await User.find({ userName: { $regex: data, $options: 'i' } });

//     if (searching) {
//       return res.render('./admin/pages/userList', { users: searching, title: 'Search' });
//     } else {
//       return res.render('./admin/pages/userList', { title: 'Search' });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// User Action
const userAction = async (req, res) => {
  const userID = req.query.id;
  const action = req.query.action;

  try {
    const user = await User.findById(userID);

    if (!user) {
      return res.status(400).send('User not found');
    }

    if (action === 'block') {
      user.isBLock = true;
    } else if (action === 'unblock') {
      user.isBLock = false;
    }
    if (req.body.password && req.body.password.length >= 6) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    await user.save();
    res.redirect('/admin/user');
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = {
  loadLogin,
  loadDashboard,
  login,
  userManagement,
 // searchUser,
  userAction,
};
