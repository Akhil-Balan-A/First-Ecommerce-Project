const Address = require('../models/addressModel')

const addressController ={
    getAllAddresses: async(req,res)=>{
        try{
            const redirectParam = req.query.redirect;
            const addresses = await Address.find({userId:req.session.user_Id})
            res.render('address',{addresses,redirectParam})
        }catch(error){
            console.log(error.message);
        }
    },
    addAddress: async(req,res)=>{
        try{
            const{ street, city, state, zipCode, country, phoneNumber,primaryAddress,redirectToCheckout}=req.body;
            const userId = req.session.user_Id;
            const redirectParam = redirectToCheckout;
            let isPrimaryAddress = false;
            const existingAddresses = await Address.find({userId})
            if(existingAddresses.length===0){
                isPrimaryAddress=true
            }else if(primaryAddress ==='newAddress'){
                await Address.updateMany({userId},{$set:{isPrimaryAddress:false}});
                isPrimaryAddress = true;
            }
            const newAddress = new Address({
                userId,
                street,
                city,
                state,
                zipCode,
                country,
                phoneNumber,
                isPrimaryAddress
            });

            await newAddress.save();
            const addresses = await Address.find({userId})
            if(redirectToCheckout==='checkout'){
                res.redirect('/order/checkout')
            }else{
                res.render('address',{message:'Address added successfully!',color:'success',addresses,redirectParam})

            }

        }catch(error){
            console.log(error.message);
        }
    },
    primaryAddressSelction:async(req,res)=>{
        try{    
            const userId = req.session.user_Id;
            const{id} = req.params;
            await Address.updateMany({userId:req.session.user_Id},{isPrimaryAddress:false});
            await Address.findByIdAndUpdate(id,{isPrimaryAddress:true});
            const addresses = await Address.find({userId})
            res.render('address',{message:'Primary address updated successfully!',color:'success',addresses})
        }catch(error){
            console.log(error);
        }
    },
    editAddressLoad : async(req,res)=>{
        try{
            const addressId = req.params.id;
            const address = await Address.findById(addressId);
            res.render('editAddress',{address})
        }catch(error){
            console.log(error.message);
        }
    },
    updateAddress: async (req,res)=>{
        try{
            const addressId = req.params.id;
            const address = await Address.findById(addressId);
            const { street, city, state, zipCode, country, phoneNumber } = req.body;
            await Address.findByIdAndUpdate(addressId,{
                street,
                city,
                state,
                zipCode,
                country,
                phoneNumber
            });
            res.render('editAddress',{message:'Address updated successfully!',color:'success',address})

        }catch(error){
            console.log(error.message);
        }
    },

    deleteAddress : async(req,res)=>{
        try{
            const addressId = req.params.id;
            const redirectParam = req.query.redirect ||'';
            await Address.findByIdAndRemove(addressId);
            const addresses = await Address.find({userId:req.session.user_Id})
            res.render('address',{message:'Address deleted successfully',color:'danger',addresses,redirectParam})

        }catch(error){
            console.log(error.message);
        }
    }
    

}



module.exports=addressController