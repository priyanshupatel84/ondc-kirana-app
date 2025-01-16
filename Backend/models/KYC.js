const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const KYCSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  panNumber: {
    type: String,
    required: true,
  },
  gstin: {
    type: String,
    required: true,
  },
  fssaiNumber: {
    type: Number,
    required: true,
  },
  panCard: {
    type: String,
    required: true,
  },
  aadhaarCard: {
    type: String,
    required: true,
  },
  gstinCertificate: {
    type: String,
    required: true,
  },
  addressProof: {
    type: String,
    required: true,
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

KYCSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const KYC = mongoose.model("KYC", KYCSchema);

module.exports = KYC;
