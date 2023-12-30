const mongoose = require('mongoose');



const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
    },
    orderQuantity: {
        type: Number,
        default: 1,
    }

})


const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    totalItems: {
        type: Number,
        default: 0,
    },
    totalSellingPrice: {
        type: Number,
        default: 0,
    },
    totalDiscount: {
        type: Number,
        default: 0,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    shipDate: {
        type: Date,
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    
    shippingCharges: {
        type: Number,
        default: 0,
    },
    isCancelled: {
        type: Boolean,
        default: false,
    },
    cancelledDate: {
        type: Date,
    },
    trackingNumber: {
        type: String,
    },
    address: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Address',
        
    },
    paymentMethod:{
        type:String
    }
    
    
}, { timestamps: true });

module.exports = mongoose.model('orders', orderSchema);