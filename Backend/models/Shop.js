const supportedProducts = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Seafood', 'Beverages', 'Snacks'];

const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    support_email: {
        type: String,
        required: true,
        trim: true
    },
    supported_products: {
        type: [String],
        enum: supportedProducts,
        default:'Not Provided'
    },
    shop_logo_url: { 
        type: String, 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

ShopSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Shop = mongoose.model('Shop', ShopSchema);

module.exports = Shop;