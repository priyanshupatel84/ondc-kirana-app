const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User ",
    required: true,
  },
  logo: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  pinCode: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
    default: "India",
  },
  supportEmail: {
    type: String,
    required: true,
    trim: true,
  },
  supportMobile: {
    type: Number,
    required: true,
    trim: true,
  },
  isLiveShop: {
    type: Boolean,
    default: false,
  },
  openingTime: {
    type: String,
    default: "09:00",
  },
  closingTime: {
    type: String,
    default: "21:00",
  },
  productCategories: {
    type: [String],
    default: [],
  },
  defaultCancellableSetting: {
    type: Boolean,
    default: false,
  },
  defaultReturnableSetting: {
    type: Boolean,
    default: false,
  },
  locationAvailability: {
    type: String,
    enum: ["PAN India", "City", "Custom"],
    default: "PAN India",
  },
  customRadius: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ShopSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Shop = mongoose.model("Shop", ShopSchema);

module.exports = Shop;
