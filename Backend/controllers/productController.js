const Product = require("../models/Product");

exports.getInventoryProducts = async (req, res) => {
  try {
    // Find all products belonging to the user
    const products = await Product.find({ user: req.user.id })
      .select(
        "productName category productImages shortDescription sellingPrice stock"
      )
      .lean();

    // Format the response data
    const formattedProducts = products.map((product) => ({
      id: product._id,
      name: product.productName,
      category: product.category,
      stock: product.stock || 0,
      productImages: product.productImages[0], // Get first image
      description: product.shortDescription,
      price: product.sellingPrice,
    }));

    res.status(200).json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching inventory products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inventory products",
      error: error.message,
    });
  }
};

// You can also update the addProduct controller to remove Inventory references
exports.addProduct = async (req, res) => {
  try {
    const {
      images,
      CancellableSetting,
      ReturnableSetting,
      CashOnDeliverySetting,
      productCode,
      ...productData
    } = req.body;

    // Check for existing product with same code for this user
    const existingProduct = await Product.findOne({
      user: req.user.id,
      productCode: productCode,
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "A product with this code already exists in your inventory",
        field: "productCode",
        type: "duplicate",
      });
    }

    // Convert image paths to appropriate format
    const productImages = Object.values(images).filter(Boolean);

    // Create product object
    const newProduct = new Product({
      ...productData,
      productCode,
      productImages,
      cancellable: CancellableSetting,
      returnable: ReturnableSetting,
      cashOnDelivery: CashOnDeliverySetting,
      user: req.user.id,
    });

    // Save the product
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);

    // Handle MongoDB duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A product with this code already exists in your inventory",
        field: "productCode",
        type: "duplicate",
      });
    }

    res.status(400).json({
      message: error.message,
      details: error.errors || "Failed to add product",
    });
  }
};
// Update product
exports.updateProduct = async (req, res) => {
  try {
    const {
      images,
      CancellableSetting,
      ReturnableSetting,
      CashOnDeliverySetting,
      ...productData
    } = req.body;

    // Convert image paths to appropriate format
    const productImages = Object.values(images).filter(Boolean);

    // Create update object
    const updateData = {
      ...productData,
      productImages,
      cancellable: CancellableSetting,
      returnable: ReturnableSetting,
      cashOnDelivery: CashOnDeliverySetting,
    };

    // Find and update the product
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you don't have permission to update it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({
      success: false,
      message: error.message,
      details: error.errors || "Failed to update product",
    });
  }
};

// In ProductController.js

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id, // Ensure user can only access their own products
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Format response to match frontend expectations
    const formattedProduct = {
      id: product._id,
      productCode: product.productCode,
      productName: product.productName,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      weight: product.weight,
      manufacturerName: product.manufacturerName,
      mrp: product.mrp,
      sellingPrice: product.sellingPrice,
      countryOfOrigin: product.countryOfOrigin,
      gstPercentage: product.gstPercentage,
      length: product.length,
      breadth: product.breadth,
      height: product.height,
      instructions: product.instructions,
      commodityName: product.commodityName,
      manufactureDate: product.manufactureDate,
      uomUnit: product.uomUnit,
      uomValue: product.uomValue,
      quantity: product.quantity,
      storageInstructions: product.storageInstructions,
      allergenInfo: product.allergenInfo,
      fssaiCertification: product.fssaiCertification,
      shelfLife: product.shelfLife,
      customerCare: product.customerCare,
      category: product.category,
      stock: product.stock,
      productImages: product.productImages,
      cancellable: product.cancellable,
      returnable: product.returnable,
      cashOnDelivery: product.cashOnDelivery,
      returnWindow: product.returnWindow,
      cancellationWindow: product.cancellationWindow,
    };

    res.status(200).json({
      success: true,
      product: formattedProduct,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product details",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id, // Ensure user can only delete their own products
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you don't have permission to delete it",
      });
    }

    // Delete the product
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
