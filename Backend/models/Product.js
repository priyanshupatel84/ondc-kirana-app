const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  // Required fields from frontend
  productCode: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  manufacturerName: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  mrp: {
    type: String,
    required: true,
  },
  sellingPrice: {
    type: String,
    required: true,
  },

  // Optional fields
  longDescription: {
    type: String,
  },
  countryOfOrigin: {
    type: String,
  },
  gstPercentage: {
    type: Number,
  },
  length: {
    type: Number,
  },
  breadth: {
    type: Number,
  },
  height: {
    type: Number,
  },
  instructions: {
    type: String,
  },
  commodityName: {
    type: String,
  },
  manufactureDate: {
    type: Date,
  },
  uomUnit: {
    type: String,
  },
  uomValue: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  storageInstructions: {
    type: String,
  },
  allergenInfo: {
    type: String,
  },
  fssaiCertification: {
    type: String,
  },
  shelfLife: {
    type: String,
  },
  customerCare: {
    type: String,
  },

  // Settings
  cancellable: {
    type: Boolean,
    default: false,
  },
  returnable: {
    type: Boolean,
    default: false,
  },
  cashOnDelivery: {
    type: Boolean,
    default: false,
  },
  returnWindow: {
    type: String,
  },
  cancellationWindow: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
  },

  // Category and Images
  category: {
    type: String,
    required: true,
  },
  productImages: {
    type: [String],
    validate: [arrayLimit, "Maximum 4 images allowed"],
    required: true,
  },

  // Reference to User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

function arrayLimit(val) {
  return val.length <= 4;
}

// Create compound index for productCode and user
ProductSchema.index({ productCode: 1, user: 1 }, { unique: true });

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
