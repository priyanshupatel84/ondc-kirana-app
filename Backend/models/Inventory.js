const mongoose = require('mongoose');
const Grocery = require('./Grocery');
const User = require('./User');


const Schema = mongoose.Schema;

const InventorySchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grocery',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the creation timestamp
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Inventory = mongoose.model('Inventory', InventorySchema);

module.exports = Inventory;