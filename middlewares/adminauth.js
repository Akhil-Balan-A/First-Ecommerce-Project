const isLogin = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            next(); // Call next() to move to the next middleware or route
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.log(error.message);
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            res.redirect('/admin/home');
        } else {
            next(); // Call next() to move to the next middleware or route
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    isLogin,
    isLogout
};
