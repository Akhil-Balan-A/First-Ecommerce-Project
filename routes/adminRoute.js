const express = require('express');
const admin_route = express();
const path = require('path')
const session = require('express-session');
const asyncHandler = require('express-async-handler')
const multer = require('multer');




admin_route.use(session({
    secret:process.env.SESSIONSECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge: 60000000}

}));



admin_route.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '-1');
    next();
});

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images'),function(err,success){
            if(err){
                throw err
            }  

        });
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name,function(error,success){
            if(error){
                throw error
            }
        });
    }
})

const upload = multer ({storage: storage})

const auth = require('../middlewares/adminauth');    
admin_route.set('view engine', 'ejs');
admin_route.set('views', path.join(__dirname, '../views/admin')); 
const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}))

const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');

//admin side routes
admin_route.get('/', auth.isLogout, asyncHandler(adminController.loadLogin));
admin_route.post('/', asyncHandler(adminController.verifyLogin));
admin_route.get('/dashboard', auth.isLogin, asyncHandler(adminController.loadAdminDashboard));
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
admin_route.get("/register",auth.isLogout,asyncHandler(adminController.loadRegister))
admin_route.post("/register",adminController.insertAdmin)
admin_route.get('/verify', asyncHandler(adminController.verifyMail))
admin_route.get('/verification',asyncHandler(adminController.emailVerificationLoad))
admin_route.post('/verification',adminController.sendVerificationLink)

//category side routes

admin_route.get('/categories',auth.isLogin,asyncHandler(categoryController.getAllCategories))
admin_route.get('/categories/add-category',auth.isLogin,asyncHandler(categoryController.addCategoryLoad))
admin_route.post('/categories/add-category',asyncHandler(categoryController.createCategory))
admin_route.get('/categories/edit-category/:id',asyncHandler(categoryController.editCategoryLoad))
admin_route.post('/categories/edit-category/:id',asyncHandler(categoryController.editCategory))
admin_route.get('/categories/delete-category/:id',asyncHandler(categoryController.deleteCategory))

//product side routes
admin_route.get('/products',auth.isLogin,asyncHandler(productController.getAllProducts))
admin_route.get('/products/add-product',auth.isLogin,asyncHandler(productController.addProductLoad))
admin_route.post('/products/add-product',upload.array('images',3),asyncHandler(productController.createProduct))
admin_route.get("/Block-product/:id",auth.isLogin,asyncHandler(productController.blockProduct));
admin_route.get("/Unblock-product/:id",auth.isLogin,asyncHandler(productController.unblockProduct))
admin_route.get('/products/edit-product/:id',auth.isLogin,asyncHandler(productController.editProductLoad))
admin_route.post('/products/edit-product/:id',upload.array('images',3),asyncHandler(productController.editProduct))
admin_route.get('/products/delete-product/:id',auth.isLogin,asyncHandler(productController.deleteProduct))

//-------------------------------orderList related.----------
admin_route.get('/orders',auth.isLogin,asyncHandler(adminController.orderListLoad))
admin_route.post('/orders/change-status/:orderId',asyncHandler(adminController.changeOrderStatus))
admin_route.post('/orders/cancel/:orderId',asyncHandler(adminController.cancelOrder))

 //admin_route.post('*',function(req,res){res.redirect('/admin')})
// admin_route.get('*',adminController.pageNotfound);
 
module.exports = admin_route;