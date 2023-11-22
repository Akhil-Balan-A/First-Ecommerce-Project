const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    
    slug:{
        type: String
    }
})

const Category = mongoose.model('category',categorySchema)

module.exports = Category;