const express = require('express');
const user_route = express();
const session = require('express-session');
const asyncHandler = require('express-async-handler')
const { query } = require('express-validator');



user_route.use(session({
    secret:process.env.SESSONSECRET,
    resave:false,
    saveUninitialized:true,
}));

user_route.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '-1');
    next();
});

user_route.use(require('connect-flash')());
user_route.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});



const auth = require('../middlewares/auth');
    
user_route.set('view engine', 'ejs');
user_route.set('views','./views/users');

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))

const userController = require('../controllers/userController')
const productController = require("../controllers/productController")

user_route.get('/register', auth.isLogout, asyncHandler(userController.loadRegister));
user_route.post('/register', asyncHandler(userController.insertUser));
user_route.get('/verify', asyncHandler(userController.verifyMail))
user_route.get('/login', auth.isLogout, asyncHandler(userController.loginLoad));
user_route.get('/', auth.isLogout, asyncHandler(userController.loginLoad));
user_route.post('/login', asyncHandler(userController.verifyLogin));
user_route.get('/home', auth.isLogin, asyncHandler(userController.loadHome));
user_route.get('/logout', auth.isLogin, asyncHandler(userController.userLogout));
user_route.get('/forget', auth.isLogout, asyncHandler(userController.forgetLoad));
user_route.post('/forget',asyncHandler(userController.forgetEmailVerify));
user_route.get('/forgot-password',auth.isLogout,asyncHandler(userController.resetPasswordLoad));
user_route.post('/forgot-password',asyncHandler(userController.resetPassword))
user_route.get('/verification',asyncHandler(userController.emailVerificationLoad))
user_route.post('/verification',userController.sendVerificationLink)
user_route.get('/products',asyncHandler(productController.getAllProducts));
user_route.get('/products/:id',asyncHandler(productController.getProductById))

module.exports = user_route;