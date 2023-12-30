const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Product = require("../models/productModel")
const Category = require("../models/categoryModel")
const randomstring = require('randomstring');
const Order = require('../models/orderModel')


const securePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash;
    }catch(error){
        console.log(error.message);
    }
}
//for send mail

const sendVerifyMail = async(name,email,user_id)=>{
    try{
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure:false,
            requireTLS:true, 
            auth:{
                user:process.env.EMAIL,
                pass: process.env.PASS
            }
        });
        const mailOptions = {
            from:process.env.EMAIL,
            to: email,
            subject:'Welcome to Boult Audio  - Verify Your Mail',
            html:`
            <p>Hi ${name},</p>
            <p>Please click here to <a href="http://127.0.0.1:3000/verify?id=${user_id}">Verify</a> your email.</p>
            <p>If you didn't sign up for an account with Boult Audio, please disregard this email.</p>
            <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at support@boultaudio.com.</p>
            <p>Thank you for choosing Boult Audio.</p>
            <p>Sincerely, The Boult Audio Team</p>
        `
        }
        transporter.sendMail(mailOptions,function(error,info){
            if (error){
                console.log(error.message)
            }else{
                console.log('Email sent: ' + info.response);

            }
        })
    }catch(error){
        console.log(error.message);
    }
}

//for reset password send mail
const sendResetPasswordMail = async(name,email,token)=>{
    try{
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure:false,
            requireTLS:true, 
            auth:{
                user:process.env.EMAIL,
                pass: process.env.PASS
            }
        });
        const mailOptions = {
            from:process.env.EMAIL,
            to: email,
            subject:'Reset User Password - The Boult Audio Team',
            html:`
            <p>Hi ${name},</p>
            <p>You've requested to reset your password at Boult Audio.</p>
            <p>Please click here to <a href="http://127.0.0.1:3000/forgot-password?token=${token}">Reset your password</a>.</p>
            <p>If you didn't request a password reset, please disregard this email.</p>
            <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at support@boultaudio.com.</p>
            <p>Thank you for choosing Boult Audio.</p>
            <p>Sincerely, The Boult Audio Team</p>
          `
        }
        transporter.sendMail(mailOptions,function(error,info){
            if (error){
                console.log(error.message)
            }else{
                console.log('Email sent: ' + info.response);

            }
        })
    }catch(error){
        console.log(error.message);
    }
}



const loadRegister = async(req,res)=>{
    try{
        res.render('registration')
        
    }catch(error){
        console.log(error.message);
    }
}

//Function to get the last used userId from the database
const getLastUserId = async()=>{
    try{
        const latestUser = await User.findOne({},{userId:1},{sort:{userId:-1}});
        if(latestUser){
            return (parseInt(latestUser.userId)+1).toString();
        }else{
            return "1000000000";
        }
    }catch(error){
        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{
    try{
        // to check the email already in user or not and length of password etc.
        const minPasswordLength = 8;
        if(req.body.password.length<minPasswordLength){
            return res.render ('registration',{
                message:`Password must be at least ${minPasswordLength}characters long`,
                color: 'danger'
            })
        }
        const existingUserByEmail = await User.findOne({email:req.body.email})
        const existingUserByMoble = await User.findOne({phoneNumber:req.body.phoneNumber})
            if (existingUserByEmail && existingUserByMoble){
                return res.render('registration',{message:"Email and Mobile Number already in Use!",color:"danger"})
            }else if(existingUserByEmail){
                return res.render('registration',{message:"Email already in Use!",color:"danger"})
           }else if(existingUserByMoble){
            return res.render('registration',{message:"Mobile Number already in Use!",color:"danger"})
           }
         // Get the last used userId
         const lastUserId = await getLastUserId();
         const user_name = req.body.firstName +''+req.body.lastName; //compines first and last name.
         const registration_date = new Date(); //current date
         const spassword = await securePassword(req.body.password);
        
        const newUser = new User({
            userId:lastUserId,
            userName:user_name,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber,
            mobileOTP:req.body.OTP,
            password:spassword,
            registrationDate:registration_date,
            is_verified:false,
            

        });

        const userData = await newUser.save();
        if (userData){
            sendVerifyMail(req.body.firstName,req.body.email,userData._id)
            res.render('registration',{message:"Your registration has been successful. Please verify Your Mail",color:'success'});
        }else{
            res.render('registration',{message:"Your registration has been failed",color:'danger'});
        }

    }catch(error){
        console.log(error.message);
    }
}

//login user methods.

const loginLoad = async (req,res)=>{
    try{
        res.render('login');

    }catch(error){
        console.log(error.message);
    }
}

const verifyLogin =async(req,res)=>{
    try{
        const {email,password,rememberMe}=req.body;
         const userData = await User.findOne({email:email});
        if(userData){
           const passwordMatch = await bcrypt.compare(password,userData.password)
           if(passwordMatch){
                if(userData.is_blocked === true){
                    res.render('login',{message:"Your account is blocked temporarly. Please contact admin"})
                }else{
                    if(userData.is_verified === false){
                        res.render('login',{message:"Please verify your Email"})
                    }else{
                        if(rememberMe){
                            const rememberToken = randomstring.generate();
                            const updatedData = await User.updateOne({email:email},{$set:{rememberToken:rememberToken}});
                            res.cookie(process.env.SESSIONSECRET, rememberToken, { maxAge: 30 * 24 * 60 * 60 * 1000 });
                        }
                    
                        req.session.user_Id = userData._id;
                        res.redirect('/home')
                    }

                }

           }else{

            res.render('login',{message:"Email and password is incorrect",color:'danger'})

           }
        }else{
            res.render('login',{message:"Email and password is incorrect",color:'danger'})
        }
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error"); // Add an error response in case of an error

    }
}

const loadHome = async(req,res)=>{
    try{
        const products = await Product.find({is_blocked:false}).lean();

        res.render('home',{products})
    }catch(error){
        console.log(error.message);
    }
}

const userLogout = async(req,res)=>{
    try{
       req.session.destroy();
       res.redirect('/login') 
    }catch(error){
        console.log(error.message);
    }
}

//forget password 
const forgetLoad = async(req,res)=>{
    try{

        res.render('forget')


    }catch(error){
        console.log(error.message);
    }

}


const verifyMail = async(req,res)=>{
    try{
        const mailVerification = await User.updateOne({_id:req.query.id},{$set:{is_verified:true}})
        console.log(mailVerification);
        res.render("email-verified")
    }catch(error){
        console.log(error.message);
    }
}

const forgetEmailVerify = async(req,res)=>{
    try{
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData){
            if(userData.is_verified === false){
                res.render ('forget', {message:" Please verify your mail ",color:'danger'})
            }else{
                const randomString = randomstring.generate();
               const updatedData = await User.updateOne({email:email},{$set:{token:randomString}});
               sendResetPasswordMail(userData.firstName,userData.email,randomString)
        
               res.render('forget',{message:"Please check your mail to reset your password",color:'success'})

            }

        }else{
            res.render('forget',{message:"User email is incorrect or Please enter a valid email id.",color:'danger'})
        }

    }catch(error){
        console.log(error.message);
    }
} 

const resetPasswordLoad = async(req,res)=>{
    try{
        const token = req.query.token;
        const tokenData = await User.findOne({token:token})
        if(tokenData){
            res.render('forgot-password',{user_id:tokenData._id});
        }else{
            res.render('404',{message:"Token is invalid!",color:"danger"})
        }

    }catch(error){
        console.log(error.message);
    }

}

const resetPassword = async (req,res)=>{
    try{
        const password = req.body.password;
        const user_id = req.body.user_id;
        
        const secure_password =await securePassword(password);
        const updatedData = await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,token:''}})
        res.render('forgot-password', { message: 'Password updated successfully, please login again', user_id:updatedData._id,color:'success' });
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");

    }
}


//for email Verification for verifiction noe done first time.

const emailVerificationLoad = async(req,res)=>{
    try{
        res.render('email-verification');

    }catch(error){
        console.log(error.message);
    }
}

const sendVerificationLink = async(req,res)=>{
    try{
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData){
            if(userData.is_verified===true){
                res.render('email-verification',{message:"Your Email is Already Verified, No need further Verification",color:'success'});
            }else{
                sendVerifyMail(userData.firstName,userData.email,userData._id);
             res.render('email-verification',{message:"Resend Verification mail send to your mail id, Please Check",color:'success'})

            }

        }else{
            res.render('email-verification',{message:"This email is not Registered",color:'danger'})
        }

    }catch(error){
        console.log(error.message);
    }
}

const loadCategories = async(req,res)=>{

    try{
        const product = await Product.find();
        const category = await Category.find();
        res.render('categories',{products:product,categories:category})
    }catch(error){
        console.log(error.message); 
    }
}

const productView = async (req,res)=>{

    const productId = req.params.id;
    const product = await Product.findById(productId)
    try{
        res.render('productsView',{product})
    }catch(error){
        console.log(error.message);
    }
}

const getProfile = async (req,res)=>{
    try{
        
        const user = await User.findById(req.session.user_Id).populate({
            path: 'orders',
            populate: {
                path: 'address',
            },
        });    
        if(!user){
            return res.status(404).render('404', {
                message: 'User not found',
                color: 'danger',
            });
        }
        res.render('userProfile',{user})
    }catch(error){
        console.log(error.message);
    }

}

const sendVerifyUser = async(name,email,code)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure:false,
        requireTLS:true, 
        auth:{
            user:process.env.EMAIL,
            pass: process.env.PASS
        }
    });
    const mailOptions = {
        from:process.env.EMAIL,
        to: email,
        subject:'boultaudio.com: Account Data access attempt',
        html:`
        <p>Hi ${name},</p>
        <p>Some one is attempting to access your account data </p>
        <p>If this was you, your verification code is <strong>${code}<strong/>.</p>
        <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at support@boultaudio.com.</p>
        <p>Thank you for choosing Boult Audio.</p>
        <p>Sincerely, The Boult Audio Team</p>
    `
    }
    transporter.sendMail(mailOptions,function(error,info){
        if (error){
            console.log(error.message)
        }else{
            console.log('Email sent: ' + info.response);

        }
    })

}
const sendResetEmail = async(name,email,code)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure:false,
        requireTLS:true, 
        auth:{
            user:process.env.EMAIL,
            pass: process.env.PASS
        }
    });
    const mailOptions = {
        from:process.env.EMAIL,
        to: email,
        subject:'boultaudio.com: Verify your new Email Id',
        html:`
        <p>Hi ${name},</p>
        <p>To verify email address. Please use the below verification code </p>
        <p> <strong>${code}<strong/>.</p>
        <p>Do not share this verification code with anyone. Boult takes your account security very seriously. Boult Customer Service will never ask you to disclose or verify your Amazon password</p>
        <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at support@boultaudio.com.</p>
        <p>Thank you for choosing Boult Audio.</p>
        <p>Sincerely, The Boult Audio Team</p>
    `
    }
    transporter.sendMail(mailOptions,function(error,info){
        if (error){
            console.log(error.message)
        }else{
            console.log('Email sent: ' + info.response);

        }
    })

}


const sendVerifyUserMobile = async(name,email,code)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure:false,
        requireTLS:true, 
        auth:{
            user:process.env.EMAIL,
            pass: process.env.PASS
        }
    });
    const mailOptions = {
        from:process.env.EMAIL,
        to: email,
        subject:'boultaudio.com: Verify your new Mobile Number',
        html:`
        <p>Hi ${name},</p>
        <p>To verify Mobile Number. Please use the below verification code </p>
        <p> <strong>${code}<strong/>.</p>
        <p>Do not share this verification code with anyone. Boult takes your account security very seriously. Boult Customer Service will never ask you to disclose or verify your Amazon password</p>
        <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at support@boultaudio.com.</p>
        <p>Thank you for choosing Boult Audio.</p>
        <p>Sincerely, The Boult Audio Team</p>
    `
    }
    transporter.sendMail(mailOptions,function(error,info){
        if (error){
            console.log(error.message)
        }else{
            console.log('Email sent: ' + info.response);

        }
    })

}

const LoginandSecurityverifyload = async(req,res)=>{
    try{
        const userId = req.session.user_Id;
        const user = await User.findById(userId)
        const code = req.body.code
        const randomCode=req.body.randomCode
        if( code === randomCode){
            req.session.code=code
            res.render('Login&Security',{user})
        }else{
           
            res.render('verifyprofileUpdation',{message:"verification failed, Try agian with correct Verification code",color:"danger",randomCode})
        }
        
    }catch(error){
        console.log(error.message);    
    }
}


const LoginandSecurityLoad = async(req,res)=>{
    try{

        const userId = req.session.user_Id;
        const user = await User.findById(userId)
        const message = req.query.success === 'Mobile Number' ? 'Mobile number successfully updated!' : null;
        if(req.session.code&&message==null){
            res.render('Login&Security',{user})
        }else if(req.session.code&&message){
            res.render('Login&Security',{user,message,color:'success'})
        }else{
            // const randomCode = randomstring.generate(8);\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
            const randomCode = 12345678;
            sendVerifyUser(user.firstName,user.email,randomCode)
            res.render('verifyprofileUpdation',{randomCode})
        }
            
    }catch(error){
        console.log(error.message);
    }
}

const NameEditPageLoad = async(req,res)=>{
    try{
       const userId = req.session.user_Id
       const user = await User.findById(userId)

        res.render('editName',{user})

    }catch(error){
        console.log(error.message);
    }
}

const updateName = async(req,res)=>{
    try{
        const userId = req.session.user_Id
        const {firstName,lastName} = req.body;
        const user = await User.findByIdAndUpdate(userId,{
            firstName,
            lastName
        })
        res.render('editName',{user,message:'Name updated successfully!',color:'success'})

    }catch(error){
        console.log(error.message);
    }
}


const newEmailVerifyLoad = async(req,res)=>{
    try{
        const userId = req.session.user_Id;
        const user = User.findById(userId)
        res.render('verifyNewEmail',{user})

    }catch(error){
        console.log(error.message);
    }
}

const verifyNewEmail = async(req,res)=>{
    try{
        const newEmail = req.body.email
        res.redirect(`/update-email?email=${encodeURIComponent(newEmail)}`);
    }catch(error){
        console.log(error.message);
    }

}
const newEmailVerificationLoad = async(req,res)=>{
    try{
        const newEmail = req.query.email
        const userId = req.session.user_Id;
        const user = await User.findById(userId)
        const randomCode = randomstring.generate(8);
        sendResetEmail(user.firstName,user.email,randomCode)
        res.render('newEmailVerification',{randomCode,newEmail})
    }catch(error){
        console.log(error.message);
    }
}

const updateEmail = async(req,res)=>{
    const userId = req.session.user_Id;
    const code = req.body.code;
    const randomCode = req.body.randomCode;
    const newEmail = req.body.newEmail;
    const email = newEmail
    if(code===randomCode){
        await User.findByIdAndUpdate(userId,{
            email
        })
        res.render('newEmailVerification',{message:"New email verified and updated successfully!",color:"success",randomCode,newEmail})

    }else{
        res.render('newEmailVerification',{message:"Verification failed, Try agian with correct Verification code",color:"danger",randomCode,newEmail})
    }
}

const updatePhoneLoad = async(req,res)=>{
    try{
        const userId = req.session.user_Id;
        const user = await User.findById(userId);
        
        res.render('updatePhone',{user});
    }catch(error){
        console.log(error.message);
    }
}

const updatePhone = async(req,res)=>{
    try{
        const userId = req.session.user_Id;
        const user = await User.findById(userId);
        const newPhoneNumber = req.body.newPhoneNumber
        if(user.phoneNumber===newPhoneNumber){
            res.render('updatePhone',{user,message:'New Mobile Number is same as existing Mobile Number!',color:'danger'})
        }
        const randomCode = randomstring.generate(8);
        req.session.mCode = randomCode;
        await sendVerifyUserMobile(user.firstName,user.email,randomCode)
        res.redirect(`/verify-phone?newPhoneNumber=${newPhoneNumber}`)

    }catch(error){
        console.log(error.message)
    }
}

const verifyPhoneLoad = async(req,res)=>{
    try{
        const newPhoneNumber = req.query.newPhoneNumber;
        res.render('verifyNewMobileNumber',{newPhoneNumber})
    }catch(error){
        console.log(error.message)
    }
}

const verifyphone = async(req,res)=>{
    const code = req.body.code;
    const newPhoneNumber = req.body.newPhoneNumber;
    const phoneNumber = newPhoneNumber
    const randomCode = req.session.mCode
    console.log(code,randomCode)
    if(code===randomCode){
        const userId = req.session.user_Id;
        await User.findByIdAndUpdate(userId,{
            phoneNumber
        })
        res.redirect('/Login&Security?success=Mobile Number')

    }else{
        res.render('verifyNewMobileNumber',{newPhoneNumber,randomCode,message:"The code you entered is not valid. Please check the code and try again",color:'danger'})
    }
}

const updatePasswordLoad = async(req,res)=>{
    try{
        res.render('updatePassword')
    }catch(error){
        console.log(error.message);
    }
}

const updatePassword = async(req,res)=>{
    try{
        const {currentPassword,newPassword,reenterNewPassword} = req.body;
        const userId = req.session.user_Id;
        const minPasswordLength = 8;
        const user = await User.findById(userId)
        // console.log(currentPassword,newPassword,reenterNewPassword,user.password)
        const passwordMatch = await bcrypt.compare(currentPassword,user.password)
        if(passwordMatch){
            if(newPassword===reenterNewPassword){
                if(newPassword.length<minPasswordLength){
                    return res.render('updatePassword',{message:`Password must be at least ${minPasswordLength}characters long`,
                    color: 'danger'})
                }else{

                    const spassword = await securePassword(newPassword);

                    await User.findByIdAndUpdate(userId,{
                        password:spassword
                    })
                        res.render('Login&Security',{user,message:'Password updated successfully!',color:'success'})

                }
            }else{
                res.render('updatePassword',{message:'Passwords do not match.Please try again',color:'danger'})
            }
        }else{
            res.render('updatePassword',{message:'current password do not match.Please try again',color:'danger'})

        }
    }catch(error){
        console.log(error.message);
    }
}

const getAllPaymentMethods = async(req,res)=>{
    try{
        const user = await User.findById(req.session.user_Id)
        const paymentMethods = User.schema.path('defaultPaymentMethod').enumValues; 
        res.render('paymentMethods',{paymentMethods,user})
    }catch(error){
        console.log(error.message)
    }

}

const savePaymentMethod = async(req,res)=>{
    try{
        const defaultPaymentMethod = req.body.defaultPaymentMethod;
        const paymentMethods = User.schema.path('defaultPaymentMethod').enumValues; 
        const userId = req.session.user_Id;
        const user = await User.findByIdAndUpdate(userId,{
            defaultPaymentMethod:defaultPaymentMethod
        });
        res.render('paymentMethods',{user,paymentMethods,message:'Default payment method updated successfully.',color:'success'})
    }catch(error){
        console.log(error.message);
    }
}

const orderPageLoad = async(req,res)=>{
    try{
        const userId = req.session.user_Id;
        const orders = await Order.find({userId}).sort({ createdAt: -1 }).populate('items.productId');
        res.render('orderList',{orders})

    }catch(error){
        console.log(error.message);
    }
}

const cancelOrder = async(req,res)=>{
    try{
        const orderId =req.params.orderId;
        const order = await Order.findById(orderId)
        if(order && order.orderStatus === 'Pending'){
            order.orderStatus = 'Cancelled';
            await order.save()
        }

        res.redirect('/orders')

    }catch(error){
        console.log(error.message);
    }
}



module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    verifyMail,
    forgetEmailVerify,
    resetPasswordLoad,
    resetPassword,
    emailVerificationLoad,
    sendVerificationLink,
    loadCategories,
    productView,

    getProfile,
    LoginandSecurityLoad,
    NameEditPageLoad,
    updateName,
    newEmailVerifyLoad,
    LoginandSecurityverifyload,
    verifyNewEmail,
    updateEmail,
    updatePhoneLoad,
    updatePhone,
    verifyPhoneLoad,
    verifyphone,
    updatePasswordLoad,
    updatePassword,
    getAllPaymentMethods,
    savePaymentMethod,
    newEmailVerificationLoad,
    orderPageLoad,
    cancelOrder

}