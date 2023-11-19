  const Admin = require("../models/userModel");
  const User = require('../models/userModel');
  const bcrypt = require("bcrypt");
  const asyncHandler = require("express-async-handler");
  const randomstring = require("randomstring");
  const nodemailer = require("nodemailer");
  const productModel = require("../models/ProductModel")

  const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  };

  //for reset password send mail
  const ResetPasswordMail = async (name, email, token) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });
      const emailOption = {
        from: process.env.EMAIL,
        to: email,
        subject: "Reset Admin Password - The Boult Audio Team",
        html: `
              <p>Hi ${name},</p>
              <p>You've requested to reset your password at Boult Audio.</p>
              <p>Please click here to <a href="http://127.0.0.1:3000/admin/forget-password?token=${token}">Reset your password</a>.</p>
              <p>If you didn't request a password reset, please disregard this email.</p>
              <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at support@boultaudio.com.</p>
              <p>Thank you for choosing Boult Audio.</p>
              <p>Sincerely, The Boult Audio Team</p>
            `,
      };
      transporter.sendMail(emailOption, function (error, info) {
        if (error) {
          console.log(error.message);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const addUserMail = async(name,email,password,user_id)=>{
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
            subject:'Welcome to Boult Audio  - Admin Added you. Please Verify ',
            html:`
            <p>Hi ${name},</p>
            <p>Please click here to <a href="http://127.0.0.1:3000/verify?id=${user_id}">Verify</a> your email.</p><br><br><b>Email:-</b>`+email+`<br><b>Password:-</b>`+password+`
            <p>If you didn't aware of this activity, please disregard this email.</p>
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


  const loadLogin = async (req, res) => {
    try {
      res.render("AdminLogin");
    } catch (error) {
      console.log(error.message);
    }
  };

  const verifyLogin = async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const adminData = await Admin.findOne({ email: email });
      if (adminData) {
        const passwordMatch = await bcrypt.compare(password, adminData.password);
        if (passwordMatch) {
          if (adminData.is_admin === false) {
            res.render("AdminLogin", { message: "Email and password is incorrect" });
          } else {
            req.session.admin_id = adminData._id;
            res.redirect("/admin/home");
          }
        } else {
          res.render("AdminLogin", { message: "Email and password is incorrect" });
        }
      } else {
        res.render("AdminLogin", { message: "Email and password is incorrect" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadDashboard = async (req, res) => {
    try {
      const adminData = await Admin.findById({_id:req.session.admin_id})
      res.render("AdminHome",{admin:adminData});
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/admin");
    } catch (error) {
      console.log(error.message);
    }
  };
  const forgetLoad = async (req, res) => {
    try {
      res.render("AdminForget");
    } catch (error) {
      console.log(error.message);
    }
  };

  const forgetVerify = async (req, res) => {
    try {
      const email = req.body.email;
      const adminData = await Admin.findOne({ email: email });
      if (adminData) {
        if (adminData.is_admin === false) {
          res.render("AdminForget", {
            message: "Email is incorrect or not an admin email",
          });
        } else {
          const randomString = randomstring.generate();
          const updatedData = await Admin.updateOne(
            { email: email },
            { $set: { token: randomString } }
          );
          ResetPasswordMail(
            adminData.firstName,
            adminData.email,
            randomString
          );
          res.render("AdminForget", {
            message: "Please check your mail to reset your password",
          });
        }
      } else {
        res.render("AdminForget", { message: "Email is incorrect" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const forgetPasswordLoad = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await Admin.findOne({ token: token });
      if (tokenData) {
        res.render("AdminForget-password", { admin_id: tokenData._id });
      } else {
        res.render("404", { message: "Invalid Link" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const resetPassword = async (req, res) => {
    try {
      const password = req.body.password;
      const admin_id = req.body.admin_id;
      const securePass = await securePassword(password);
      await Admin.findByIdAndUpdate(
        { _id: admin_id },
        { $set: { password: securePass, token: "" } }
      );

      res.render("AdminLogin");
    } catch (error) {
      console.log(error.message);
    }
  };

  const adminDashboard = async(req,res)=>{
    try{
      var search = '';
      if(req.query.search){
        search = req.query.search
      }
      var page = 1;
      if(req.query.page){
        page = req.query.page
      }

      const limit = 2;

      const userData = await Admin.find({is_admin:false,
        $or:[
          {firstName:{$regex:'.*'+search+'.*',$options:'i'}},
          {phoneNumber:{$regex:'.*'+search+'.*',$options:'i'}},
          {email:{$regex:'.*'+search+'.*',$options:'i'}}
        ]
      }).limit(limit * 1)
      .skip((page-1)* limit)
      .exec();


      const count = await Admin.find({is_admin:false,
        $or:[
          {firstName:{$regex:'.*'+search+'.*',$options:'i'}},
          {phoneNumber:{$regex:'.*'+search+'.*',$options:'i'}},
          {email:{$regex:'.*'+search+'.*',$options:'i'}}
        ]
      }).countDocuments();


      res.render('adminDashboard',{
        users:userData,
        totalPages:Math.ceil(count/limit),
        currentPage : page
      })

    }catch(error){
      console.log(error);
    }
  }

  //add new user

  const newUserLoad  = async(req,res)=>{
    try{  
      res.render('new-user')
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

  const addUser = async(req,res)=>{
    try{

      const existingUser = await User.findOne({email:req.body.email})
        if (existingUser){
          return res.render('new-user',{message:"Email already in Use!"})
        }
      const lastUserId = await getLastUserId();

      const user_name = req.body.firstName +''+req.body.lastName; //compines first and last name.
      const registration_date = new Date(); //current date

      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;
      const phoneNumber = req.body.phoneNumber
      const password =randomstring.generate(10);
      
      const spassword = await securePassword(password)

      const user = new User({
        userName:user_name,
        userId:lastUserId,
        firstName:firstName,
        lastName:lastName,
        email:email,
        registrationDate:registration_date,
        phoneNumber:phoneNumber,
        password:spassword,
        is_verified:false,
        is_admin: false

      });

      const userData = await user.save();
      if(userData){
        addUserMail(firstName,email,password,userData._id)
        res.redirect('/admin/dashboard');
      }else{
        res.render('new-user',{message:"Something went wrong"})
      }

    }catch(error){
      console.log(error.message);
    }
  }

  const blockUser = async(req,res)=>{
    try{
      await User.findByIdAndUpdate(req.params.id,{is_blocked:true},{new:true})
      res.redirect('/admin/dashboard')
    }catch(error){
      console.log(error.message);
    }
  }

  const unblockUser = async(req,res)=>{
    try{
      await User.findByIdAndUpdate(req.params.id,{is_blocked:false},{new:true})
      res.redirect("/admin/Dashboard")
    }catch(error){
      console.log(error.message);
    }
  }
  const productView = async(req,res)=>{
    try{ 
      
      let products = await productModel.find({deleteProduct: false}).populate('activities').lean()
      res.render('products',{admin:true, products,Products:"active", heading: "Products"})
      }catch(error){
      console.log(error.message);
    }

  }

  const addProduct = async(req,res)=>{
    try{
      res.render('addProduct')
      
    }catch(error){
      console.log(error.message);
    }
  }

const  addProductPost =async (req,res)=>{
    try{
      

    }catch(error){

    }
  }


  module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    adminDashboard,
    newUserLoad,
    addUser,
    addUserMail,
    blockUser,
    unblockUser,

    addProduct,
    productView,
    addProductPost
    
  };