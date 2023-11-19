const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId:{
        type: Number,
        unique: true,
        required:true,
        default:1000000000,
        minlength:10
    },
    firstName:{
        type: String,
        required: true,
        minlength:2,
        maxlength:20
    },
    lastName:{
        type: String,
        required: true,
        minlength:2,
        maxlength:20
    },
    userName:{
        type: String,
        minlength:4,
        maxlength:20,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    },
    password:{
        type: String,
        required: true,
        minlength:10
    },
   
    
    phoneNumber:{
        type: String,
        required: true,
        minlength:10,
        maxlength:10
    },
    
    registrationDate:{
        type: Date,
        required:true
    },

    notification:{
        type: String,
    },
  
    is_admin:{
        type: Boolean,
        default: false
    },
    is_verified:{
        type: Boolean,
        default: false
    },
    token:{
        type:String,
        default:''
    },
    is_blocked:{
        type:Boolean,
        default:false
        
    }
    
})

module.exports = mongoose.model('User', userSchema);

