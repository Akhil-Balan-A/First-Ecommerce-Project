const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    slug:{
        type:String,
        required:true
    },

    description:{
        type: String,
        required:true
    },
    category:{
        type:String,
        required:true
      },
   
    images: {
        type: Array,
        required: true,
        validate:[imageLimit,'You can pass only 3 product images']
    },
    price:{
        type:Number,
        required: true,

    },
    sellingPrice:{
        type:Number,
        required: true,
    },
    stockQuantity:{
        type: Number,
        required: true,

    },

    review:{
        type: String,
        
    },
    rating:{
        type: Number,
        default: 2,
       
    },
    discount:{
        type: Number,
        required:true
     
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    isWishlisted:{
        type:Boolean,
        default:false
    },
    isOnCart:{
        type:Boolean,
        default:false
    },
    trending:{
        type:Boolean,
        default:false
    }

},{timestamps:true});

function imageLimit(val){
    return val.length <=3
}


const productModel = mongoose.model('Products',productSchema)

module.exports = productModel
