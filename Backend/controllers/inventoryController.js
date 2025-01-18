const express = require('express');
const Inventory = require('../models/Inventory');  

const router = express.Router();

// GET route to fetch all products linked to Grocery schema
exports.getInventoryItems = async (req, res) => {
    try {
        const userId=req.user.id;
        const inventoryItems = await Inventory.find()
        .populate({
            path: 'product',
            match: { user: userId }, // Filter Grocery documents by userId
        });
         // Filter out Inventory documents where the populate operation resulted in null
         const filteredItems = inventoryItems.filter(item => item.product !== null);

         res.status(200).json(filteredItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

