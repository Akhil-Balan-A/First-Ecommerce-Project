const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },

    items:[
        {
            productId:{type:mongoose.Schema.Types.ObjectId,ref:'Products'}, //derive product details from the referenced Product model. 
            quantity:{type:Number,default:1,min: 1},//product quantity 
            

        }
    ]

},{timestamps:true});

module.exports = mongoose.model('Cart',cartSchema);