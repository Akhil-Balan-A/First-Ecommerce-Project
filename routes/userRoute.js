const express = require('express');
const user_route = express();
const session = require('express-session');
const asyncHandler = require('express-async-handler')
const cookieParser = require('cookie-parser');
const cartItemCount = require('../middlewares/cartItemsCount')



user_route.use(cartItemCount)


user_route.use(session({
    secret:process.env.SESSIONSECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge: 60000000}
}));

user_route.use(cookieParser());

user_route.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '-1');
    next();
});

const auth = require('../middlewares/auth');
    
user_route.set('view engine', 'ejs');
user_route.set('views','./views/users');

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))

 const userController = require('../controllers/userController');
const cartController = require("../controllers/cartController");
const checkoutController  = require('../controllers/checkoutController')
const addressController = require('../controllers/addressController')

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
user_route.get('/categories',auth.isLogin,asyncHandler(userController.loadCategories));
user_route.get('/product/:id',auth.isLogin,asyncHandler(userController.productView))
//--------------profile Routes----------------
user_route.get('/profile',auth.isLogin,asyncHandler(userController.getProfile))
//----------------login and security routes---------------------
user_route.get('/Login&Security',auth.isLogin,asyncHandler(userController.LoginandSecurityLoad))
user_route.post('/Login&Security',asyncHandler(userController.LoginandSecurityverifyload))
user_route.get('/edit-name',auth.isLogin,asyncHandler(userController.NameEditPageLoad))
user_route.post('/edit-name',asyncHandler(userController.updateName))

user_route.get('/verify-newEmail',auth.isLogin,asyncHandler(userController.newEmailVerifyLoad))
user_route.post('/verify-newEmail',asyncHandler(userController.verifyNewEmail))
user_route.get('/update-email',auth.isLogin,asyncHandler(userController.newEmailVerificationLoad))
user_route.post('/update-email',asyncHandler(userController.updateEmail))

user_route.get('/update-phone',asyncHandler(userController.updatePhoneLoad))
user_route.post('/update-phone',asyncHandler(userController.updatePhone))
user_route.get('/verify-phone',asyncHandler(userController.verifyPhoneLoad))
user_route.post('/verify-phone',asyncHandler(userController.verifyphone))
user_route.get('/update-password',auth.isLogin,asyncHandler(userController.updatePasswordLoad))
user_route.post('/update-password',asyncHandler(userController.updatePassword))
//------------cart routes----------
user_route.post('/cart',asyncHandler(cartController.addToCart))
user_route.get('/cart',auth.isLogin,asyncHandler(cartController.cartLoad))
user_route.get('/cart/remove/:id',auth.isLogin,asyncHandler(cartController.removeCartItem))
user_route.post('/cart/updateQuantity/:id',asyncHandler(cartController.updateQuantity))


//----------------checkout Routes ----------------
user_route.get('/order/checkout',asyncHandler(checkoutController.displayCheckoutPage))
user_route.post('/order/checkout',asyncHandler(checkoutController.createNewOrder))

//-----------------Address Routes-------------

user_route.get('/address',auth.isLogin,asyncHandler(addressController.getAllAddresses))
user_route.post('/address',asyncHandler(addressController.addAddress))
user_route.get('/address/set-primary/:id',asyncHandler(addressController.primaryAddressSelction))
user_route.get('/address/edit/:id',auth.isLogin,asyncHandler(addressController.editAddressLoad))
user_route.post('/address/edit/:id',asyncHandler(addressController.updateAddress))
user_route.get('/address/delete/:id',auth.isLogin,asyncHandler(addressController.deleteAddress))

//-------------------Payment Options-------------------
user_route.get('/payment-options',auth.isLogin,asyncHandler(userController.getAllPaymentMethods))
user_route.post('/payment-options',asyncHandler(userController.savePaymentMethod))
//--------------order related routes
user_route.get('/orders',auth.isLogin,asyncHandler(userController.orderPageLoad))
user_route.post('/orders/cancel/:orderId',asyncHandler(userController.cancelOrder))

module.exports = user_route;

