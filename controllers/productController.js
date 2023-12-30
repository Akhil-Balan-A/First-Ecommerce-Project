const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const path = require('path');
const fs = require('fs');


const productController = {

    getAllProducts: async(req,res) =>{
        try{
            const products = await Product.find()
            const count = await Product.countDocuments();
            res.render('products',{products,count,currentPage:'products'})
        }catch(error){
            console.log(error.message);
        }
    },
    addProductLoad: async(req,res) =>{

        try{
            const categories = await Category.find()
            res.render('addProduct',{categories:categories})
        }catch(error){
            console.log(error.message);
        }
    },
    createProduct: async(req,res)=>{
        const categories = await Category.find()
        const {name,description,price,category,stockQuantity,discount}=req.body
        const slug = name.replace(/\s+/g, '-').toLowerCase();
        const sellingPrice = price-(price*(discount/100))
        const arrImages = [];
       

        try{
            for (let i = 0;i<req.files.length;i++){
                arrImages[i]=req.files[i].filename;
            }
           
            const existingProduct = await Product.findOne({slug})
            
            if (existingProduct){
                res.render('addProduct',{message:"Product name already exists. Please choose a different Product name.",
                color:'danger',categories:categories})
            }else if(price<0){
                res.render('addProduct',{message:"Product price cannot be a negative value. Please Enter a valid price.",
                color:'danger',categories:categories})
            }else if(stockQuantity<0){
                res.render('addProduct',{message:"Product Quantity Cannot be a negative value. Please Enter a valid price.",
                color:'danger',categories:categories})
            }else if(discount<0&&discount<=100){
                res.render('addProduct',{message:"Product discount must be a valid percentage under 100%. Please Enter a valid discount.",
                color:'danger',categories:categories})
            }else{
                const newProduct = new Product({name,
                    description,
                    price,
                    sellingPrice,
                    category,
                    stockQuantity,
                    slug,
                    discount,
                    images:arrImages,

                })
                const savedProduct = await newProduct.save();
                res.render('addProduct',{message:"Product added successfully.",color: 'success',categories:categories})

            }
        }catch(error){
            console.log(error.message);
        }

    },
    blockProduct: async(req,res)=>{
        try{
          await Product.findByIdAndUpdate(req.params.id,{is_blocked:true},{new:true})
          res.redirect('/admin/products')
        }catch(error){
          console.log(error.message);
        }
    },
    unblockProduct:  async(req,res)=>{
        try{
          await Product.findByIdAndUpdate(req.params.id,{is_blocked:false},{new:true})
          res.redirect("/admin/products")
        }catch(error){
          console.log(error.message);
        }
    },
    editProductLoad: async(req,res)=>{
        try{
            const categories = await Category.find()
            const productId = req.params.id;
            const products = await Product.findById(productId);
            if(!products){
                res.render('products',{message:"product not exist", color:'danger',currentPage:"products"})
            }else{
                res.render('editProduct',{products,categories})//******need to check the alredy selected category comming or not
            }
        }catch(error){
            console.log(error.message);
        }
    },
    editProduct: async(req,res)=>{
        const categories = await Category.find()
        const productId = req.params.id;
        const product = await Product.findById(productId);
        console.log('req.body',req.body);
        const {name,description,category,stockQuantity,discount,price}=req.body;
        const sellingPrice= price - (price * (discount / 100));
        console.log('name',name);
        const slug = name.replace(/\s+/g, '-').toLowerCase();
        let arrImages = [];

        try{
            if(req.files&&req.files.length>0){
                for(let i = 0;i<req.files.length;i++){
                    arrImages[i]=req.files[i].filename;
                }
            }else{
                    arrImages = product.images
            }
            
            
            const existingProduct = await Product.findById({slug});
            if(existingProduct && existingProduct._id.toString() !== productId){
                res.render('editProduct',{message:"Product name already exists. Please choose a different product name.",
                color:'danger',categories:categories,products:product});
            }else if(price<0){
                res.render('editProduct',{message:"Product Price cannot be a negative value. Please enter a valid price.",
                color:'danger',categories:categories,products:product});
            }else if(stockQuantity<0){
                res.render('editProduct',{message: "Product Quantity cannot be a negative value. Please Enter a valid Quantity",
                color:'danger',categories:categories,products:product});
            }else if(discount<0||discount>100){
                res.render('editProduct',{message:"Product discount must be a valid number under 100%. Please enter a valid dicount",
                color:"danger",categories:categories,products:product})
            }else{
                const updatedProduct = await Product.findByIdAndUpdate(
                    productId,
                    {name,
                    description,
                    sellingPrice,
                    price,
                    category,
                    stockQuantity,
                    slug,
                    discount,
                    images:arrImages},
                    {new:true}
                );
                res.render('editProduct',{message:"Product added successfully",color:'success',categories})
            }

        }catch(error){
            console.log(error.message);
        }

    },
    deleteProduct: async(req,res)=>{
        const productId = req.params.id;
        try{
            const product = await Product.findById(productId);
            if(!product){
                return res.redirect('/admin/products');
            }else{
                const imagesToDelete = product.images.map(image => path.join(__dirname, '../public/images', image));
                imagesToDelete.forEach(imagePath =>{
                    if(fs.existsSync(imagePath)){
                        fs.unlinkSync(imagePath);
                    }
                });
                await Product.findByIdAndDelete(productId);
                res.redirect('/admin/products')
            }
        }catch(error){
            console.log(error.message);
        }

    }

}


module.exports = productController