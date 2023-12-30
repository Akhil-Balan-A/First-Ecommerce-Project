const Category = require('../models/categoryModel');

const categoryController = {

    getAllCategories: async (req, res) => {
        try {
          const page = parseInt(req.query.page) || 1;
          const perPage = 3;
          let query = {}; // Default empty query
    
          if (req.query.search) {
            // If search parameter is provided, add search conditions to the query
            const searchRegex = new RegExp(req.query.search, 'i'); // Case-insensitive search
            query = {
              $or: [
                { name: searchRegex },
                { description: searchRegex },
                // Add more fields for search if needed
              ],
            };
          }
    
          const categories = await Category.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage);
    
          const totalCategories = await Category.countDocuments(query);
          const totalPages = Math.ceil(totalCategories / perPage);
    
          res.render('categories', {
            categories,
            currentPage: 'categories',
            totalPages,
            currentPageNumber: page,
            page,
          });
        } catch (error) {
          console.log(error.message);
        }
      },
    addCategoryLoad:async(req,res)=>{
        try{
            res.render('addCategory')
        }catch(error){
            console.log(error.message);
        }
    },
    createCategory: async(req,res)=>{
        const {name,description}= req.body
        const slug = name.replace(/\s+/g, '-').toLowerCase();
        try{
            const existingCategory = await Category.findOne({slug});
            if(existingCategory){
                res.render('addCategory',{message:"Category already exists. Please choose a different category name.",
                color:'danger'})
                return;
            }else{
                const newCategory = new Category({name,description,slug})
                const savedCategory = await newCategory.save();
                res.render('addCategory',{message:"Category added Sucessfully",color:'success'})
            }
            
        }catch(error){
            console.log(error.mesage);
        }
    },
    editCategoryLoad: async(req,res)=>{
        try{
            const categoryId = req.params.id;
            const category = await Category.findById(categoryId);
            if(!category){
                res.render('categories',{message:'Category not exist',color:'danger'})
            }else{
                res.render('editCategories',{category})
            }
        }catch(error){
            console.log(error.message);
        }
    },
    editCategory: async(req,res)=>{
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        const {name,description}=req.body
        const slug = name.replace(/\s+/g, '-').toLowerCase();

        try{
            const existingCategory = await Category.findOne({slug,_id:{$eq:categoryId}});
            if(existingCategory){
                res.render('editCategories',{message:"Category name already exists",color: 'danger',category})
            }else{
                const updateCategory = await Category.findByIdAndUpdate(
                    categoryId,
                    {name,description,slug},
                    {new:true}
                    );
                    
                    res.render('editCategories',{message:"Category updated successfully",color:'sucess',category})
            }

        }catch(error){
            console.log(error.mesage);
        }
    },
    deleteCategory:async(req,res)=>{
        const categoryId=req.params.id;

        try{
            await Category.findByIdAndDelete(categoryId)
            res.redirect('/admin/categories')
        }catch(error){
            console.log(error.message);
        }
    }




}







module.exports = categoryController