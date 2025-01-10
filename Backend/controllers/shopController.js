const Shop = require('../models/Shop'); // Assuming the Shop model is in the models directory


// Register a new shop
exports.registerShop = async (req, res) => {
    try {
        const userId=req.user.id;
        const { name,address,support_email,phone,supported_products,shop_logo_url } = req.body;

        const shop = await Shop.create({userId,name,address,support_email,phone,supported_products,shop_logo_url });
        res.status(201).json({ message: 'Shop registered successfully!', shop });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update shop details
exports.updateShop = async (req, res) => {
    try {
        const { id } = req.params;
        const { name,address,support_email,phone,supported_products,shop_logo_url } = req.body;
        const shop = await Shop.findById(id);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        if (name) shop.name = name;
        if (address) shop.address = address;
        if (support_email) shop.support_email = support_email;
        if (phone) shop.phone = phone;
        if (supported_products) shop.supported_products = supported_products;
        if (shop_logo_url) shop.shop_logo_url = shop_logo_url;

        
        

        await shop.save();
        res.json({ message: 'Shop updated successfully!', shop });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a shop
exports.deleteShop = async (req, res) => {
    try {
        const { id } = req.params;
        const shop = await Shop.findById(id);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        await Shop.findByIdAndDelete(id);
        res.json({ message: 'Shop deleted successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get shop details by ID
exports.getShopById = async (req, res) => {
    try {
        const { id } = req.params;
        const shop = await Shop.findById(id);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        res.json(shop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};