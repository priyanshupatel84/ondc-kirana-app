const mongoose = require('mongoose');
const { create } = require('./User');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    customer_name: {
        type: String,
        required: true
    },
    order_status: {
        type: String,
        required: true
    },
    order_items: [
        {
            product_id: {
                type: String,
                required: true
            },
            product_name: {
                type: String,
                required: true
            },
            product_price: {
                type: Number,
                required: true
            },
            product_quantity: {
                type: Number,
                required: true
            }
        }
    ],
    total_price: {
        type: Number,
        required: true
    },
    order_date: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});