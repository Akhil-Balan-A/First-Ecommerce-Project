const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    
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
    username:{
        type: String,
        minlength:4,
        maxlength:50,
        required:true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        // match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    },
    password:{
        type: String,
        required: true,
        minlength:10
    },
    
    phoneNumber:{
        type: Number,
        required: true,
        minlength:10,
        maxlength:10
    },
    
    is_verified:{
        type: Boolean,
        default: false
    },
    token:{
        type:String,
        default:''
    },
    is_admin:{
        type:Boolean,
        default:true
    }
    
    
});

module.exports = mongoose.model('admins', adminSchema);
