const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const productModel = require("../models/ProductModel")

const randomstring = require('randomstring');
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
        // to check the email already in user or not.
        const existingUser = await User.findOne({email:req.body.email})
            if (existingUser){
                return res.render('registration',{message:"Email already in Use!"})
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
            res.render('registration',{message:"Your registration has been successful. Please verify Your Mail"});
        }else{
            res.render('registration',{message:"Your registration has been failed"});
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
        const email = req.body.email;
        const password = req.body.password;
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
                        req.session.user_Id = userData._id;
                        res.redirect('/home')
                    }

                }

           }else{

            res.render('login',{message:"Email and password is incorrect"})

           }
        }else{
            res.render('login',{message:"Email and password is incorrect"})
        }
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error"); // Add an error response in case of an error

    }
}

const loadHome = async(req,res)=>{
    try{
        res.render('home')
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
                res.render ('forget', {message:" Please verify your mail "})
            }else{
                const randomString = randomstring.generate();
               const updatedData = await User.updateOne({email:email},{$set:{token:randomString}});
               sendResetPasswordMail(userData.firstName,userData.email,randomString)
        
               res.render('forget',{message:"Please check your mail to reset your password"})

            }

        }else{
            res.render('forget',{message:"User email is incorrect."})
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
            res.render('404',{message:"Token is invalid!"})
        }
        res.render('forgot-password')

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
        res.redirect('/login')
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
             sendVerifyMail(userData.firstName,userData.email,userData._id);
             res.render('email-verification',{message:"Resend Verification mail send to your mail id, Please Check"})

        }else{
            res.render('email-verification',{message:"This email is not Registered"})
        }

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
    
   

}