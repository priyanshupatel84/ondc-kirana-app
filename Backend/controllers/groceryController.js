const Grocery = require('../models/Grocery');

// Add a new product
exports.addProduct = async (req, res) => {
    try {
        const newProduct = new Grocery(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a product by ID
exports.getProduct = async (req, res) => {
    try {
        const product = await Grocery.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Grocery.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const product = await Grocery.findByIdAndUpdate(req.params.id, req.body, { new: true });    
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

