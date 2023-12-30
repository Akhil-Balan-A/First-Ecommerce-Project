// notes
// //express validator - need to check how to use

// <% if (typeof message !== "undefined") { %>
//     <div class="alert alert-success" role="alert">
//         <%= message %>
//     </div>
// <% } %>

// <!--flash message-->
// <%- messages('messages', locals) %>

// <% Object.keys(messages).forEach(function (type) { %>
//     <div class="alert alert-<%=type%>">

//       <% messages[type].forEach(function (message) { %>
//       <%= message %>
//       <% }) %>
//     </div>
//     <% }) %>







//     <%- messages('messages', locals) %>

  
//     <% if (message && message.length > 0) { %>
//         <div class="alert alert-danger" role="alert">
//             <%= message[0] %>
//         </div>
//     <% } %>




//     createCategory: async (req, res) => {
//         const { name, description } = req.body;
//         const slug = name.replace(/\s+/g, '-').toLowerCase();
//         req.checkBody('name','name must have a value.').notEmpty();
//         var errors =req.validationErrors();
//         if(errors){
//           res.render('addCategory',{errors:errors,name: name})
//         }else{
//           Category.findOne({slug:slug},function(err,category){
//             if(category){
//               req.flash('danger','Category name exists, choose another one.');
//               res.render('addCategory',{name:name})
//             }else{
//               const category = new Category({
//                 name: name,
//                 slug: slug
//               });
//               category.save(function(err){
//                 if(err)
//                 return console.log(err);
//               req.flash('success','category added');
//               res.redirect('/admin/categories')
//               })
//             }
//           })
//         }
//         try {
//           const newCategory = new Category({ name, description,slug});
//           const savedCategory = await newCategory.save();
//           res.render('addCategory',{message:"Category added successfully"})
//         } catch (error) {
//           console.error(error.message);
//           res.status(500).send('Internal Server Error');
//         }
//       },


// product.ejs code.

// <%- include('../layouts/adminHeader.ejs') %>

// <div class="container mt-4">
//     <h2 class="page-title mb-4">Products</h2>
//     <a href="/admin/products/add-product" class="btn btn-primary mb-4">Add new Product</a>
    
//     <% if(count>0){%>
        
   

//     <table class="table table-striped">
//         <thead>
//             <tr>
//                 <th scope="col">Sl.No</th>
//                 <th scope="col">Product</th>
//                 <th scope="col">Price</th>
//                 <th scope="col">Category</th>
//                 <th scope="col">Quantity</th>
//                 <th scope="col">Images</th>
//                 <th scop="col">Action</th>
//                 <th scope="col">Edit</th>
//                 <th scope="col">Delete</th>
//             </tr>
//         </thead>
//         <tbody>
//             <% for( let i=0; i < products.length; i ++ ) { %>
//                 <% i %>
//             <%}%>
//             <% products.forEach(function(product) { %>
//                 <tr>
//                     <td><%=  %></td> //serila number
//                     <td><%= product.name %></td>
//                     <td><%= parseFloat(product.price).toFixed(2)%></td>
//                     <td><%= product.category %></td>
//                     <td><%= product.category %></td>
//                     <td><%= product.name %></td>
//                     <td><a href="/admin/products/edit-product/<%= product._id %>" class="btn btn-warning btn-sm">Edit</a></td>
//                     <td>
//                         <a href="/admin/categories/delete-product/<%= product._id %>" class="btn btn-danger btn-sm confirmDeletion">Delete</a>
//                     </td>
//                 </tr>
//             <% }) %>
//         </tbody>
//     </table>

//     <%}else{%>
//         <h3 class="text-center">There are no products</h3>
//     <%}%>
// </div>
// <br><br><br>
// <%- include('../layouts/adminFooter.ejs') %>







// <div class="form-group">
//               <label for="colors">Select Colors:</label>
//               <select name="colors" id="colors" multiple>
//                 <option value="red">Red</option>
//                 <option value="blue">Blue</option>
//                 <option value="green">Green</option>
//                 <option value="black">Black</option>
//                 <option value="white">White</option>
//                 <option value="grey">Grey</option>
//                 <option value="brown">Brown</option>
//                 <option value="orange">Orange</option>
//                 <option value="pink">Pink</option>
//                 <option value="light_green">Light Green</option>
//                 <option value="light_blue">Light Blue</option>
//               </select>
//             </div>











//             const Product = require('../models/productModel');
// const Category = require('../models/categoryModel');
// const path = require('path');
// const fs = require('fs');


// const productController = {

//     getAllProducts: async(req,res) =>{
//         try{
//             const products = await Product.find()
//             const count = await Product.countDocuments();
//             res.render('products',{products,count,currentPage:'products'})
//         }catch(error){
//             console.log(error.message);
//         }
//     },
//     addProductLoad: async(req,res) =>{

//         try{
//             const categories = await Category.find()
//             res.render('addProduct',{categories:categories})
//         }catch(error){
//             console.log(error.message);
//         }
//     },
//     createProduct: async(req,res)=>{
//         const categories = await Category.find()
//         const {name,description,price,category,stockQuantity,discount,color1,color2,color3}=req.body
//         const slug = name.replace(/\s+/g, '-').toLowerCase();
//         const sellingPrice = price-(price*(discount/100))
//         const arrImages = [];
//         const arrColors = [color1,color2,color3];
       

//         try{
//             for (let i = 0;i<req.files.length;i++){
//                 arrImages[i]=req.files[i].filename;
//             }
           
//             const existingProduct = await Product.findOne({slug})
            
//             if (existingProduct){
//                 res.render('addProduct',{message:"Product name already exists. Please choose a different Product name.",
//                 color:'danger',categories:categories})
//             }else if(price<0){
//                 res.render('addProduct',{message:"Product price cannot be a negative value. Please Enter a valid price.",
//                 color:'danger',categories:categories})
//             }else if(stockQuantity<0){
//                 res.render('addProduct',{message:"Product Quantity Cannot be a negative value. Please Enter a valid price.",
//                 color:'danger',categories:categories})
//             }else if(discount<0&&discount<=100){
//                 res.render('addProduct',{message:"Product discount must be a valid percentage under 100%. Please Enter a valid discount.",
//                 color:'danger',categories:categories})
//             }else{
//                 const newProduct = new Product({name,
//                     description,
//                     price,
//                     sellingPrice,
//                     category,
//                     stockQuantity,
//                     slug,
//                     discount,
//                     images:arrImages,
//                     colors:arrColors
//                 })
//                 const savedProduct = await newProduct.save();
//                 res.render('addProduct',{message:"Product added successfully.",color: 'success',categories:categories})

//             }
//         }catch(error){
//             console.log(error.message);
//         }

//     },
//     blockProduct: async(req,res)=>{
//         try{
//           await Product.findByIdAndUpdate(req.params.id,{is_blocked:true},{new:true})
//           res.redirect('/admin/products')
//         }catch(error){
//           console.log(error.message);
//         }
//     },
//     unblockProduct:  async(req,res)=>{
//         try{
//           await Product.findByIdAndUpdate(req.params.id,{is_blocked:false},{new:true})
//           res.redirect("/admin/products")
//         }catch(error){
//           console.log(error.message);
//         }
//     },
//     editProductLoad: async(req,res)=>{
//         try{
//             const categories = await Category.find()
//             const productId = req.params.id;
//             const products = await Product.findById(productId);
//             if(!products){
//                 res.render('products',{message:"product not exist", color:'danger',currentPage:"products"})
//             }else{
//                 res.render('editProduct',{products,categories})//******need to check the alredy selected category comming or not
//             }
//         }catch(error){
//             console.log(error.message);
//         }
//     },
//     editProduct: async(req,res)=>{
//         const categories = await Category.find()
//         const productId = req.params.id;
//         const product = await Product.findById(productId);
//         console.log('req.body',req.body);
//         const {name,description,category,stockQuantity,discount,price,color1,color2,color3}=req.body;
//         const sellingPrice= price - (price * (discount / 100));
//         console.log('name',name);
//         const slug = name.replace(/\s+/g, '-').toLowerCase();
//         let arrImages = [];
//         let arrColors =[color1,color2,color3];

//         try{
//             if(req.files&&req.files.length>0){
//                 for(let i = 0;i<req.files.length;i++){
//                     arrImages[i]=req.files[i].filename;
//                 }
//             }else{
//                     arrImages = product.images
//             }
            
            
//             const existingProduct = await Product.findById({slug});
//             if(existingProduct && existingProduct._id.toString() !== productId){
//                 res.render('editProduct',{message:"Product name already exists. Please choose a different product name.",
//                 color:'danger',categories:categories,products:product});
//             }else if(price<0){
//                 res.render('editProduct',{message:"Product Price cannot be a negative value. Please enter a valid price.",
//                 color:'danger',categories:categories,products:product});
//             }else if(stockQuantity<0){
//                 res.render('editProduct',{message: "Product Quantity cannot be a negative value. Please Enter a valid Quantity",
//                 color:'danger',categories:categories,products:product});
//             }else if(discount<0||discount>100){
//                 res.render('editProduct',{message:"Product discount must be a valid number under 100%. Please enter a valid dicount",
//                 color:"danger",categories:categories,products:product})
//             }else{
//                 const updatedProduct = await Product.findByIdAndUpdate(
//                     productId,
//                     {name,
//                     description,
//                     sellingPrice,
//                     price,
//                     category,
//                     stockQuantity,
//                     // slug,
//                     discount,
//                     images:arrImages,
//                     colors:arrColors},
//                     {new:true}
//                 );
//                 res.render('editProduct',{message:"Product added successfully",color:'success',categories})
//             }

//         }catch(error){
//             console.log(error.message);
//         }

//     },
//     deleteProduct: async(req,res)=>{
//         const productId = req.params.id;
//         try{
//             const product = await Product.findById(productId);
//             if(!product){
//                 return res.redirect('/admin/products');
//             }else{
//                 const imagesToDelete = product.images.map(image => path.join(__dirname, '../public/images', image));
//                 imagesToDelete.forEach(imagePath =>{
//                     if(fs.existsSync(imagePath)){
//                         fs.unlinkSync(imagePath);
//                     }
//                 });
//                 await Product.findByIdAndDelete(productId);
//                 res.redirect('/admin/products')
//             }
//         }catch(error){
//             console.log(error.message);
//         }

//     }



// }


// module.exports = productController








// <%- include('../layouts/adminHeader.ejs') %>

// <title>Edit Product</title>
// </head>
// <body>
//   <br>
//   <h2 class="page-title mb-4">&nbsp;&nbsp; Edit Product</h2>
//   <div class="container-fluid mt-4">
//     <div class="row">
//       <!-- Left Sidebar -->
//       <div class="col-md-2" style="height: 220vh;">
//         <ul class="list-group">
//           <!-- Home Heading -->
//           <li class="list-group-item list-group-item-grey">Home</li>
//           <li class="list-group-item"><a href="/admin/dashboard"><i class="fa-solid fa-house fa-icon" style="font-size: 14px; padding: 0px"></i>Dashboard</a></li>
//           <li class="list-group-item"><a href="/admin/sales-report"><i class="fa-solid fa-file-invoice "></i>&nbsp; Sales Report</a></li>

//           <!-- Controls Heading -->
//           <li class="list-group-item list-group-item-grey">Controls</li>
//           <li class="list-group-item"><a href="/admin/orders"><i class="fa-solid fa-clipboard-list"></i>&nbsp; Orders</a></li>
//           <li class="list-group-item"><a href="/admin/categories"><i class="fa-solid fa-layer-group" style="font-size: 14px; padding: 0px"></i>&nbsp; Category</a></li>
//           <li class="list-group-item"><a href="/admin/users"> <i class="fa-solid fa-users" style="font-size: 14px; padding: 0px"></i>&nbsp; Users</a></li>

//           <!-- Editing Functions Heading -->
//           <li class="list-group-item list-group-item-grey">View/Edit Functions</li>
//           <li class="list-group-item"><a href="/admin/products"><i class="fa-solid fa-store"></i>&nbsp; View/Edit Products</a></li>
//           <li class="list-group-item"><a href="/admin/coupons"><i class="fa-solid fa-ticket" style="font-size: 14px; padding: 0px"></i>&nbsp; View/Edit Coupon</a></li>
//           <li class="list-group-item"><a href="/admin/banners"><i class="fa-solid fa-receipt" style="font-size: 18px; padding: 0px"></i>&nbsp; View/Edit Banner</a></li>
//         </ul>
//       </div>

//       <!-- Right Content -->
//       <div class="col-md-10" style="height: 220vh;">
//         <div class="container ">
//           <a href="/admin/products" class="btn btn-primary mb-4">Back to Products </a>
         
         
//           <% if (typeof message !== 'undefined') { %>
//             <% if(color==='danger') { %>
//                 <div class="alert alert-danger text-center" role="alert">
//                     <p><%- message %></p>
//                 </div>
//             <% } else { %>
//                 <div class="alert alert-success text-center" role="alert">
//                     <p><%- message %></p>
//                 </div>
//             <% } %>
//         <% } %>
            
          
//           <form action="/admin/products/edit-product/<%=products._id%>" method="post" enctype="multipart/form-data">
//               <div class="form-group">
//                   <label for="name">Name</label>
//                   <input type="text" class="form-control" name="name" value="<%=products.name%>"  placeholder="Enter Product Name" required minlength="2">
//               </div>
          
//               <div class="form-group">
//                   <label for="description">Description</label>
//                   <textarea name="description" class="form-control" cols="30" rows="10" placeholder="Enter Product Description" required><%=products.description%></textarea>
//               </div>
//               <div class="form-group">
//                   <label for="category">Category</label>
//                   <select name="category" class="form-control">
//                       <%categories.forEach(function(cat){%>
//                         <option value="<%=cat.slug%>" <%=cat.slug===products.category ? 'selected' : ''%>><%=cat.name%></option>
//                       <%})%>
      
//                   </select>
//               </div>
//               <div class="form-group">
//                 <label for="stockQuantity">Stock Quantity</label>
//                 <input type="number" class="form-control" name="stockQuantity" value="<%=products.stockQuantity%>" placeholder="Enter Quantity of Product" required >
//             </div>
//               <div class="form-group">
//                   <label for="price">Price</label>
//                   <input type="text" class="form-control" name="price" value="<%=products.price%>" placeholder="Enter Price" required>
//               </div>
//               <div class="form-group">
//                 <label for="discount">Discount</label>
//                 <input type="number" class="form-control" name="discount" value="<%=products.discount%>" placeholder="Enter Discount Percentage" required>
//             </div>
//             <div class="form-group">
//               <label for="color1">Select Color 1:</label>
//               <select name="color1" id="color1" class="form-control color-dropdown">
//                   <option disabled selected value="">Choose Color</option>
//                   <option value="red">Red</option>
//                   <option value="blue">Blue</option>
//                   <option value="green">Green</option>
//                   <option value="black">Black</option>
//                   <option value="white">White</option>
//                   <option value="grey">Grey</option>
//                   <option value="brown">Brown</option>
//                   <option value="orange">Orange</option>
//                   <option value="pink">Pink</option>
//                   <option value="light_green">Light Green</option>
//                   <option value="light_blue">Light Blue</option>
//               </select>
//             </div>
      
//             <div class="form-group">
//               <label for="color2">Select Color 2:</label>
//               <select name="color2" id="color2" class="form-control color-dropdown">
//                   <option disabled selected value="">Choose Color</option>
//                   <option value="red">Red</option>
//                   <option value="blue">Blue</option>
//                   <option value="green">Green</option>
//                   <option value="black">Black</option>
//                   <option value="white">White</option>
//                   <option value="grey">Grey</option>
//                   <option value="brown">Brown</option>
//                   <option value="orange">Orange</option>
//                   <option value="pink">Pink</option>
//                   <option value="light_green">Light Green</option>
//                   <option value="light_blue">Light Blue</option>
//               </select>
//             </div>
      
//             <div class="form-group">
//               <label for="color3">Select Color 3:</label>
//               <select name="color3" id="color3" class="form-control color-dropdown">
//                   <option disabled selected value="">Choose Color</option>
//                   <option value="red">Red</option>
//                   <option value="blue">Blue</option>
//                   <option value="green">Green</option>
//                   <option value="black">Black</option>
//                   <option value="white">White</option>
//                   <option value="grey">Grey</option>
//                   <option value="brown">Brown</option>
//                   <option value="orange">Orange</option>
//                   <option value="pink">Pink</option>
//                   <option value="light_green">Light Green</option>
//                   <option value="light_blue">Light Blue</option>
//               </select>
//             </div>
            
//               <div class="form-group">
//                 <label for="image1">Image1</label>
//                 <input type="file" class="form-control" name="images1" id="image1" required onchange="previewImage('image1','imgPreview1')">
//                 <button style="font-size: 12px;" type="button" class="btn btn-danger" onclick="removeImage('image1','imgPreview1')">Remove File</button>
//                 <br>
//                 <img style="width:200px; height: auto;" src="#" id="imgPreview1"alt="" class="img-preview">
//               </div>
//               <div class="form-group">
//                 <label for="image2">Image2</label>
//                 <input type="file" class="form-control" name="images2" id="image2"  onchange="previewImage('image2','imgPreview2')">
//                 <button style="font-size: 12px;" type="button" class="btn btn-danger" onclick="removeImage('image2','imgPreview2')">Remove File</button>
//                 <br>
//                 <img style="width:200px; height: auto;" src="#" id="imgPreview2" alt="" class="img-preview">
//               </div>
//               <div class="form-group">
//                 <label for="image3">Image3</label>
//                 <input type="file" class="form-control" name="images3" id="image3"  onchange="previewImage('image3','imgPreview3')">
//                 <button style="font-size: 12px;" type="button" class="btn btn-danger" onclick="removeImage('image3','imgPreview3')">Remove File</button>
//                 <br>
//                 <img style="width:200px; height: auto;" src="#" id="imgPreview3" alt="" class="img-preview">
//               </div>
              
//               <div class="form-group">
//                 <button class="btn btn-primary">Submit</button>
      
//               </div>
      
//           </form>
//       </div>
//       <br><br><br>
//       </div>
//     </div>
//   </div>

//   <script>
//     function previewImage(inputId,previewId){
//       const input = document.getElementById(inputId);
//       const preview = document.getElementById(previewId);
//       const file = input.files[0];
  
//       if(file){
//         const reader = new FileReader();
//         reader.onload = function(e){
//           preview.src = e.target.result;
//         };
//         reader.readAsDataURL(file);
//       }else{
//         preview.src = "";
//       }
//     }
//     function removeImage(inputId,previewId){
//       const input = document.getElementById(inputId);
//       const preview = document.getElementById(previewId);
//       input.value = "";
//       preview.src = "";
//     }
//   </script>
  
  
  
// <%- include('../layouts/adminFooter.ejs') %>















