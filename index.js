const express = require("express");
const dotenv = require('dotenv').config()
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const dbConnect = require('./config/dbConnect')
dbConnect();
const expressValidator = require('express-validator');
const flash = require('connect-flash');

const app = express();

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
// app.use(expressValidator()); 


app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});



app.use((req, res, next) => {
    res.set(
        "Cache-control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
});



//for user routes.
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);


//for admin routes.
const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute);

// Apply the error handling middlewares

app.use(notFound);
app.use(errorHandler);


const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server Running on the port number ${port}`);
});













