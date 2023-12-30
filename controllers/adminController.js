  const Admin = require("../models/adminModel");
  const User = require('../models/userModel');
  const bcrypt = require("bcrypt");
  const randomstring = require("randomstring");
  const nodemailer = require("nodemailer");
  const Order = require('../models/orderModel')


  //for send mail

const sendVerifyMail = async(name,email,admin_id)=>{
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
          <p>Please click here to <a href="http://127.0.0.1:3000/admin/verify?id=${admin_id}">Verify</a> your email.</p>
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
            res.render("AdminLogin", { message: "Email and password is incorrect",color:"danger"});
          } else {
            if(adminData.is_verified===true){
              req.session.admin_id = adminData._id;
            res.redirect("/admin/dashboard");
            }else{
              res.render("AdminLogin",{message:"Please Verify your Email",color:"danger"})
            }
          }
        } else {
          res.render("AdminLogin", { message: "Email and password is incorrect",color:"danger" });
        }
      } else {
        res.render("AdminLogin", { message: "Email and password is incorrect",color:"danger" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadAdminDashboard = async (req, res) => {
    try {
  
      const adminData = await Admin.findById({_id:req.session.admin_id})
      res.render("AdminDashboard",{admin:adminData,currentPage:'dashboard'});
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
            message: "Email is incorrect or not an admin email",color:"danger"
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
            message: "Please check your mail to reset your password",color:'success'
          });
        }
      } else {
        res.render("AdminForget", { message: "Email is incorrect",color:"danger" });
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
        res.render("404", { message: "Invalid Link",color:"danger" });
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

      res.render("AdminForget-password",{ admin_id:"undefined",message:"Successfully updated the Password. Please login",color:"success"});
      
    } catch (error) {
      console.log(error.message);
    }
  };

  const userManagement = async(req,res)=>{
    try{
      var search = '';
      if(req.query.search){
        search = req.query.search
      }
      var page = 1;
      if(req.query.page){
        page = req.query.page
      }
      const statusFilter = req.query.status || '';
      const query = {
        $or: [
          { firstName: { $regex: '.*' + search + '.*', $options: 'i' } },
          { phoneNumber: { $regex: '.*' + search + '.*', $options: 'i' } },
          { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        ],
      };

      if (statusFilter) {
        switch (statusFilter) {
          case 'verified':
            query.is_verified = true;
            break;
          case 'not_verified':
            query.is_verified = false;
            break;
          case 'blocked':
            query.is_blocked = true;
            break;
          case 'not_blocked':
            query.is_blocked = false;
            break;
        }
      }

      const limit = 2;
    const userData = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.find(query).countDocuments();

      res.render('users',{
        users:userData,
        totalPages:Math.ceil(count/limit),
        currentPage : page,
        currentPageName:'users'
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
      res.render('new-user',{message: error.meessage})
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

      const existingUserByEmail = await User.findOne({email:req.body.email})
      const existingUserByMobile = await User.findOne({phoneNumber:req.body.phoneNumber})
        if (existingUserByEmail && existingUserByEmail){
          return res.render('new-user',{message:"Email and Mobile Number already in Use!",color:"danger"})
        }else if(existingUserByEmail){
          return res.render('new-user',{message:"Email already in Use!",color:"danger"})

        }else if(existingUserByMobile){
          return res.render('new-user',{message:"Mobile Number already in Use!",color:"danger"})

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
        res.render('new-user',{message:"Successfully added user and User credential send to the email, Please verify email to access the website",color:'success'});
      }else{
        res.render('new-user',{message:"Something went wrong",color:'danger'})
      }

    }catch(error){
      console.log(error.message);
    }
  }

  const blockUser = async(req,res)=>{
    try{
      await User.findByIdAndUpdate(req.params.id,{is_blocked:true},{new:true})
      res.redirect('/admin/users')
    }catch(error){
      console.log(error.message);
    }
  }

  const unblockUser = async(req,res)=>{
    try{
      await User.findByIdAndUpdate(req.params.id,{is_blocked:false},{new:true})
      res.redirect("/admin/users")
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

  const loadRegister = async(req,res)=>{
    try{

      res.render('adminRegistration')
    }catch(error){
      console.log(error.message);
    }
    
  }

  const insertAdmin = async(req,res)=>{
    try{
        // to check the email already in user or not and number checking.
        const minPasswordLength = 8;
        if(req.body.password.length<minPasswordLength){
            return res.render ('Adminregistration',{
                message:`Password must be at least ${minPasswordLength}characters long`,
                color: 'danger'
            })
        }

        const existingAdminByEmail = await Admin.findOne({email:req.body.email})
        const existingAdminByMoble = await Admin.findOne({phoneNumber:req.body.phoneNumber})
            if (existingAdminByEmail && existingAdminByMoble){
                return res.render('Adminregistration',{message:"Email and Mobile Number already in Use!",color:"danger"})
            }else if(existingAdminByEmail){
                return res.render('Adminregistration',{message:"Email already in Use!",color:"danger"})
           }else if(existingAdminByMoble){
            return res.render('Adminregistration',{message:"Mobile Number already in Use!",color:"danger"})
           }


            const user_name = req.body.firstName +''+req.body.lastName; //compines first and last name.
            const spassword = await securePassword(req.body.password);
            
        const newAdmin = new Admin({
            username:user_name,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber,
            password:spassword,
            is_verified:false,
            is_admin:true

        });

        const adminData = await newAdmin.save();
        if (adminData){
            sendVerifyMail(req.body.firstName,req.body.email,adminData._id)
            res.render('adminRegistration',{message:"Your registration has been successful. Please verify Your Mail",color: "success"});
        }else{
            res.render('adminRegistration',{message:"Your registration has been failed",color: 'danger'});
        }

    }catch(error){
        console.log(error.message);
    }
}

const verifyMail = async(req,res)=>{
  try{
      const mailVerification = await Admin.updateOne({_id:req.query.id},{$set:{is_verified:true}})
      console.log(mailVerification);
      res.render("email-verified")
  }catch(error){
      console.log(error.message);
  }
}


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
      const adminData = await Admin.findOne({email:email});
      if(adminData){
        if(adminData.is_verified===false){
          
          sendVerifyMail(adminData.firstName,adminData.email,adminData._id);
          res.render('email-verification',{message:"Resend Verification mail send to your mail id, Please Check",color:"success"})

        }else{
          res.render('email-verification',{message:"This email id is already verified!. so not need further verification",color:"success"})

        }
           
      }else{
          res.render('email-verification',{message:"This email is not Registered",color:"danger"})
      }

  }catch(error){
      console.log(error.message);
  }
}


//page no found.

const pageNotfound = async(req,res)=>{
  try{  
     res.render('404',{message:"Error 404 Page Not Found", color: "danger"})
  }catch(error){
    console.log(error.message);
  }
}

const orderListLoad = async(req,res)=>{
  try{
    const orders = await Order.find().sort({createdAt: -1}).populate('items.productId')
    res.render('adminOrderList',{orders,currentPage:'orders'})

  }catch(error){
    console.log(error.message);
  }
}

const changeOrderStatus =async(req,res)=>{
  try{
     const orderId = req.params.orderId;
     const newStatus = req.body.status
     const order = await Order.findById(orderId);
     if(order){
      order.orderStatus = newStatus;
      await order.save();
     }
     res.redirect('/admin/orders')

  }catch(error){
    console.log(error.message);
  }
}

const cancelOrder = async(req,res)=>{
  try{
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if(order && order.orderStatus === 'Pending'){
      order.orderStatus = 'Cancelled';
      await order.save();
    }
    res.redirect('/admin/orders')
    
  }catch(error){
    console.log(error.message);
  }
}
  module.exports = {
    loadLogin,
    verifyLogin,
    loadAdminDashboard,
    logout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    userManagement,
    newUserLoad,
    addUser,
    addUserMail,
    blockUser,
    unblockUser,

    addProduct,
    productView,
    addProductPost,

    loadRegister,
    insertAdmin,
    verifyMail,
    emailVerificationLoad,
    sendVerificationLink,
    
    pageNotfound,
    orderListLoad,
    cancelOrder,
    changeOrderStatus
  };

