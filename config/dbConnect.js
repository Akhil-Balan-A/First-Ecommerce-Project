const mongoose = require('mongoose');
const dbConnect = ()=>{
    try{
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected Successfully");
    }catch(error){
        console.log(error.message);
    }

};

module.exports = dbConnect;