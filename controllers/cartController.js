const Cart =require('../models/cartModel');
const Product = require('../models/productModel');

const cartController = {
    cartLoad: async (req, res) => {
        try {
            const userId = req.session.user_Id;
             let cart = await Cart.findOne({ userId }).populate('items.productId');
             if(!cart){
                res.render('cart',{message:"No items added to cart",color:'danger',cart})
             }else{
                res.render('cart', {cart});
             }
            
        } catch (error) {
            console.log(error.message);
        }
    },
    addToCart:async(req,res)=>{
        try{
            const productId = req.body.productId;
            const userId =  req.session.user_Id;
            const quantity = 1
            const product = await Product.findById(productId)
            let cart = await Cart.findOne({userId});
            if(!cart){
                cart = new Cart({userId,items:[]});
            }
            const existingItem = cart.items.find(item=>item.productId.toString()===productId);
            if(existingItem){
                existingItem.quantity +=quantity;
            }else{
                cart.items.push({productId,quantity})
            }

            await cart.save();
            const totalItems = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

            res.render('productsView',{product})

        }catch(error){
            console.log(error.message);
        }
    },
    

    removeCartItem: async(req,res)=>{
        try{
            const productIdToRemove = req.params.id
            const userId = req.session.user_Id

            const updatedCart = await Cart.findOneAndUpdate(
            {userId},
            {$pull:{items:{productId:productIdToRemove}}},
            {new:true}
            ).populate('items.productId');
                res.redirect('/cart');
        }catch(error){
            console.log('error removig item from cart');
            console.log(error.message);
        }

    },
    updateQuantity: async(req,res)=>{
        try{
            const productIdToUpdate = req.params.id;
            const userId = req.session.user_Id;
            const newQuantity = req.body.quantity;
            const updateCart = await Cart.findOneAndUpdate(
                {userId,'items.productId':productIdToUpdate},
                {$set:{'items.$.quantity':newQuantity}},
                {new:true}
            ).populate('items.productId');
            res.redirect('/cart')
        }catch(error){
            console.log(error.message);
        }
    }


}


module.exports = cartController;