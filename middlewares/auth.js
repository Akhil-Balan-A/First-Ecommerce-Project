const isLogin = (req, res, next) => {
    try {
        if (req.session.user_Id) {
            // User is logged in, allow them to proceed
            next();
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error.message);
        // You should handle errors appropriately here
        res.status(500).send("Internal Server Error");
    }
};

const isLogout = (req, res, next) => {
    try {
        if (req.session.user_Id) {
            res.redirect('/home');
        } else {
            // User is not logged in, allow them to proceed
            next();
        }
    } catch (error) {
        console.log(error.message);
        // You should handle errors appropriately here
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    isLogin,
    isLogout
};
