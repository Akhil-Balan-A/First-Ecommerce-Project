const express = require("express");
const session = require('express-session');

const dotenv = require('dotenv').config()
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const dbConnect = require('./config/dbConnect')
const cartItemCount = require('./middlewares/cartItemsCount')
dbConnect();
const path = require('path')


const app = express();


app.use(session({
    secret:process.env.SESSIONSECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge: 600000}
}));

app.use(express.static(path.join(__dirname,'./public')))
app.use(express.urlencoded({ extended: false }));
  
app.use((req, res, next) => {
    res.set(
        "Cache-control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
});


app.use(cartItemCount)

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
















