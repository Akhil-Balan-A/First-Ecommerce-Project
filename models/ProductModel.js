const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required:true
    },
    color1: {
        type: String,
        required: true
    },
    color2: {
        type: String,
        required:true

    },
    category:{
        type: String,
        required: true
    },
    imagesDetails:{
        type: Array,
        required: true
    },
    price:{
        type:Number,
        required: true,
        min: [0, 'price must be a positive number']

    },
    stockQuantity:{
        type: Number,
        required: true,
        min: [0, 'Quantity must be a positive number']

    },
    OrderQuantity:{
        type: Number,
        required: true,
        min: [1, 'Quantity must be a positive number']

    },
    deleteProduct:{
        type:Boolean,
        default:false
    },
    review:{
        type: String,
        
    },
    rating:{
        type: Number,
        default: 0,
        min: [0, 'Rating must be a non-negative number'],
        max: [5, 'Rating must be between 0 and 5']
    },
    discount:{
        type: Number,
        default: 0,
        min: [0, 'Discount must be a non-negative number'],
        max: [100, 'Discount must be between 0 and 100']
    },
    activities: {
        type: [String], // Array of strings representing activities
        required: true
    }

},
{
    timestamps: true
}
)

const productModel = mongoose.model('Products',productSchema)

module.exports = productModel
