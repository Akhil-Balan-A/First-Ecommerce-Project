const Category = require('../models/categoryModel');

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.render('categories',{  categories: categories});
    
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  },

  addCategoryLoad: async (req, res) => {

    try {
      res.render('addCategory');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  },




  // getCategoryById: async (req, res) => {
  //   const categoryId = req.params.id;

  //   try {
  //     const category = await Category.findById(categoryId);
  //     res.render('addCategory');
  //   } catch (error) {
  //     console.error(error.message);
  //     res.status(500).send('Internal Server Error');
  //   }
  // },

  createCategory: async (req, res) => {
    const { name, description } = req.body;
    const slug = name.replace(/\s+/g, '-').toLowerCase();
    
    try {
      const newCategory = new Category({ name, description,slug});
      const savedCategory = await newCategory.save();
      res.render('addCategory',{message:"Category added successfully"})
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  },

  updateCategory: async (req, res) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { name, description },
        { new: true }
      );
      res.json(updatedCategory);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  },

  deleteCategory: async (req, res) => {
    const categoryId = req.params.id;

    try {
      await Category.findByIdAndDelete(categoryId);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = categoryController;
