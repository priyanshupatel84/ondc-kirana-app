const express = require('express');
const {
    getInventoryItems,
  } = require("../controllers/inventoryController");
const {updateProduct}=require("../controllers/groceryController")
const { authenticate } = require("../middlewares/authMiddleware");


const router = express.Router();

// Get all inventory items
router.get('/', authenticate, getInventoryItems);

// Update Inventory Items
router.put('/:id', authenticate, updateProduct);


module.exports = router; 