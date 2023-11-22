const Product = require('../models/productModel');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find().populate('category');
      res.json(products);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  },

  getProductById: async (req, res) => {
    const productId = req.params.id;

    try {
      const product = await Product.findById(productId).populate('category');
      res.json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  },

  createProduct: async (req, res) => {
    const { name, description, price, category, images } = req.body;

    try {
      const newProduct = new Product({ name, description, price, category, images });
      const savedProduct = await newProduct.save();
      res.json(savedProduct);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  },

  updateProduct: async (req, res) => {
    const productId = req.params.id;
    const { name, description, price, category, images } = req.body;

    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name, description, price, category, images },
        { new: true }
      ).populate('category');
      res.json(updatedProduct);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  },

  deleteProduct: async (req, res) => {
    const productId = req.params.id;

    try {
      await Product.findByIdAndDelete(productId);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = productController;
