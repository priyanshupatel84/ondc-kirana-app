const validator = require('validator');
const Shop = require('../models/Shop'); // Assuming the Shop model is in the models directory

// Helper function to validate shop data
const validateShopData = (data) => {
    const errors = [];

    if (!data.name || !validator.isLength(data.name, { min: 3, max: 50 })) {
        errors.push('Shop name must be between 3 and 50 characters.');
    }
    if (!data.address || !validator.isLength(data.address, { min: 10, max: 200 })) {
        errors.push('Address must be between 10 and 200 characters.');
    }
    if (data.support_email && !validator.isEmail(data.support_email)) {
        errors.push('Invalid support email address.');
    }
    if (data.phone && !validator.isMobilePhone(data.phone, 'any')) {
        errors.push('Invalid phone number.');
    }
    if (data.shop_logo_url && !validator.isURL(data.shop_logo_url)) {
        errors.push('Invalid shop logo URL.');
    }
    if (
        data.supported_products &&
        (!Array.isArray(data.supported_products) || data.supported_products.some((p) => typeof p !== 'string'))
    ) {
        errors.push('Supported products must be an array of strings.');
    }

    return errors;
};

// Register a new shop
exports.registerShop = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, address, support_email, phone, supported_products, shop_logo_url } = req.body;

        const validationErrors = validateShopData({ name, address, support_email, phone, supported_products, shop_logo_url });
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        const shop = await Shop.create({ userId, name, address, support_email, phone, supported_products, shop_logo_url });
        res.status(201).json({ message: 'Shop registered successfully!', shop });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update shop details
exports.updateShop = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, support_email, phone, supported_products, shop_logo_url } = req.body;

        const validationErrors = validateShopData({ name, address, support_email, phone, supported_products, shop_logo_url });
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

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
