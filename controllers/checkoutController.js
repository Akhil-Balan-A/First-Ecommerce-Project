const Order = require('../models/orderModel');
const Address = require('../models/addressModel')
const Cart = require('../models/cartModel')
const User = require('../models/userModel')
const Product = require("../models/productModel")


const checkoutController = {
    displayCheckoutPage: async (req,res)=>{
        try{
                // Find the user to get their default address and payment method
            const user = await User.findById(req.session.user_Id).populate('addresses')
                // Get the default address details (if available)
            let selectedAddressDetails;

            const defaultAddress = user.addresses.find(address=>address.isPrimaryAddress)
            if(defaultAddress){
                selectedAddressDetails = `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.zipCode}`;
            }
            // Get the default payment method
            const selectedPaymentMethod = user.defaultPaymentMethod;
                // Find the cart for the current user
            const cart = await Cart.findOne({ userId:req.session.user_Id }).populate('items.productId');
                // Find all addresses for the user to choose
                const addresses = await Address.find({userId:req.session.user_Id})

            const paymentMethods = User.schema.path('defaultPaymentMethod').enumValues;  
            res.render('checkout',{addresses,paymentMethods,cart,selectedPaymentMethod,selectedAddressDetails,user})
        }catch(error){
            console.log(error.message);
        }
    },


     createNewOrder:async(req,res)=>{
            try{
                const productId = req.query.productId;
                const quantity = req.query.quantity || 1;
                const selectedPaymentMethod = req.body.selectedPaymentMethod
                const selectedAddressId = req.body.selectedAddress
                console.log(selectedAddressId,selectedPaymentMethod)

                const selectedAddress = await Address.findById(selectedAddressId);
                console.log(selectedAddress,'this is address model')
                const cart = await Cart.findOne({ userId: req.session.user_Id }).populate('items.productId');

                const user = await User.findById(req.session.user_Id);
                const defaultPaymentMethod = user.defaultPaymentMethod;

                const totalAmount = cart.items.reduce((sum, item) => sum + (item.quantity * item.productId.sellingPrice), 0);
                const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
                const totalSellingPrice = totalAmount;
                const totalDiscount = cart.items.reduce((sum, item) => sum + (item.productId.price - item.productId.sellingPrice) * item.quantity, 0);
                function generateTrackingNumber() {
                    // Get the current date and time
                    const currentDate = new Date();
                    
                    // Format date and time as YYYYMMDDHHmmss
                    const formattedDate = currentDate.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
                
                    // Generate a random 4-digit number
                    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                
                    // Combine date/time and random number to create the tracking number
                    const trackingNumber = `TRK-${formattedDate}-${randomDigits}`;
                
                    return trackingNumber;
                }
                const trackingNumber = generateTrackingNumber();
                const paymentMethodToUse = selectedPaymentMethod || defaultPaymentMethod || 'Cash on Delivery';

                
                const newOrder = new Order({
                    userId: req.session.user_Id,
                    items: cart.items,
                    totalAmount,
                    totalItems,
                    totalSellingPrice,
                    totalDiscount,
                    address: selectedAddress,
                    orderStatus: 'Pending',
                    trackingNumber,
                    paymentMethod:paymentMethodToUse
                });

                await newOrder.save();
                //clear the user's cart items.
                await Cart.deleteOne({ userId: req.session.user_Id });

                res.redirect('/'); // Redirect to home page or order confirmation page

            }catch(error){
                console.log(error.message);
            }
        }



}


module.exports = checkoutController
