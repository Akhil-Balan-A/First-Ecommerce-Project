const Cart = require('../models/cartModel');

const cartItemCount = async (req, res, next) => {
  try {
    if (req.session.user_Id) {
      const userId = req.session.user_Id;
      const cart = await Cart.findOne({ userId });

      // Calculate total items in the cart
      const totalItems = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

      // Add totalItems to response locals
      res.locals.totalItems = totalItems;
    } else {
      // If there is no user session, set totalItems to 0
      res.locals.totalItems = 0;
    }

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.log(error.message);
    // Handle errors here, you might want to redirect to an error page
    console.log('Internal Server Error in cart middleware');
    res.status(500).send('Internal Server Error');
  }
};

module.exports = cartItemCount;
