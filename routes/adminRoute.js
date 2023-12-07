const express = require('express');
const path = require('path');
const adminRoute = express.Router();
const expressLayouts = require('express-ejs-layouts'); 
const multer = require('multer');
const adminController = require('../controller/adminController');
const categoryController = require('../controller/categoryController');
const productController = require('../controller/productControl')
const adminAuth=require('../middleware/adminAuth')


require('dotenv').config()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, path.join(__dirname, '../public/admin/uploads'));},


  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });



adminRoute.use(express.json());
adminRoute.use(express.urlencoded({ extended: true }));
adminRoute.use((req, res, next) => {
  req.app.set('layout', 'admin/layout/admin');
  next();
});







adminRoute.get('/', adminController.loadLogin);
adminRoute.post('/',adminController.login);

adminRoute.get('/dashboard', adminController.loadDashboard);



adminRoute.get('/user', adminController.userManagement)
//adminRoute.post('/user/search',adminController.searchUser)
adminRoute.get("/useractions", adminController.userAction);



// categoryManagement--- 
adminRoute.get('/category',categoryController.categoryManagement)
adminRoute.get('/addCategory', categoryController.addCategory)
adminRoute.post('/addCategory', categoryController.insertCategory)
adminRoute.get('/category/list/:id', categoryController.list)
adminRoute.get('/category/unList/:id', categoryController.unList)
adminRoute.get('/editCategory/:id', categoryController.editCategory)
adminRoute.post('/editCategory/:id',categoryController.updateCategory)
adminRoute.post('/category/search',categoryController.searchCategory)




// // Product Management---
adminRoute.get('/product', productController.productManagement);
adminRoute.get('/product/addProduct', productController.addProduct);
adminRoute.post('/product/addProduct',
    upload.fields([
        { name: "secondaryImage",maxCount:8 }
        ,         { name: "primaryImage", maxCount: 3 }
      ]),
    productController.insertProduct)  /** Product adding and multer using  **/

    adminRoute.post('/product/list/:id', productController.listProduct);
    adminRoute.post('/product/unList/:id', productController.unListProduct);
    adminRoute.get('/product/editproduct/:id', productController.editProductPage);


adminRoute.post('/product/editproduct/:id',
    upload.fields([
        { name: "secondaryImage", maxCount: 8 },
        { name: "primaryImage", maxCount: 3 }
    ]),
    productController.updateProduct);




module.exports = adminRoute;
