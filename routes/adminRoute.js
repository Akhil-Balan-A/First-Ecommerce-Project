const express = require('express');
const admin_route = express();
const path = require('path')

const session = require('express-session');
const asyncHandler = require('express-async-handler')





admin_route.use(session({
    secret:process.env.SESSONSECRET,
    resave:false,
    saveUninitialized:true
}));

admin_route.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '-1');
    next();
});

const auth = require('../middlewares/adminauth');    
admin_route.set('view engine', 'ejs');
admin_route.set('views', path.join(__dirname, '../views/admin')); 
const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}))

const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');

admin_route.get('/', auth.isLogout, asyncHandler(adminController.loadLogin));
admin_route.post('/', asyncHandler(adminController.verifyLogin));
admin_route.get('/home', auth.isLogin, asyncHandler(adminController.loadAdminHome));
admin_route.get('/logout', auth.isLogin, asyncHandler(adminController.logout));
admin_route.get('/forget', auth.isLogout , asyncHandler(adminController.forgetLoad));
admin_route.post('/forget', asyncHandler(adminController.forgetVerify));
admin_route.get('/forget-password', auth.isLogout,asyncHandler(adminController.forgetPasswordLoad));
admin_route.post('/forget-password',asyncHandler(adminController.resetPassword));
admin_route.get('/users', auth.isLogin,asyncHandler(adminController.userManagement));
admin_route.get('/new-user',auth.isLogin,asyncHandler(adminController.newUserLoad));
admin_route.post('/new-user',adminController.addUser)
admin_route.get("/Block-user/:id",auth.isLogin,asyncHandler(adminController.blockUser));
admin_route.get("/Unblock-user/:id",auth.isLogin,asyncHandler(adminController.unblockUser))

admin_route.get('/categories',auth.isLogin, asyncHandler(categoryController.getAllCategories));
admin_route.get('/categories/add-category',auth.isLogin,asyncHandler(categoryController.addCategoryLoad));
admin_route.post('/categories/add-category', asyncHandler(categoryController.createCategory));





admin_route.get("/Products",auth.isLogin,asyncHandler(adminController.productView))
admin_route.get("/addProduct",auth.isLogin,asyncHandler(adminController.addProduct))
admin_route.get("/register",auth.isLogout,asyncHandler(adminController.loadRegister))
admin_route.post("/register",adminController.insertAdmin)
admin_route.get('/verify', asyncHandler(adminController.verifyMail))
admin_route.get('/verification',asyncHandler(adminController.emailVerificationLoad))
admin_route.post('/verification',adminController.sendVerificationLink)




admin_route.put('/categories/:id', asyncHandler(categoryController.updateCategory));
admin_route.delete('/categories/:id', asyncHandler(categoryController.deleteCategory));

admin_route.get('/products', asyncHandler(productController.getAllProducts));
admin_route.get('/products/:id', asyncHandler(productController.getProductById));
admin_route.post('/products', asyncHandler(productController.createProduct));
admin_route.put('/products/:id', asyncHandler(productController.updateProduct));
admin_route.delete('/products/:id', asyncHandler(productController.deleteProduct));

admin_route.post('*',function(req,res){res.redirect('/admin');})
 
module.exports = admin_route;