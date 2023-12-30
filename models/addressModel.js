const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    isPrimaryAddress:{
        type:Boolean,
        required:true
    }
    
});

module.exports = mongoose.model('Address', addressSchema);
