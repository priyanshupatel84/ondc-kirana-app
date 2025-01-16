const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BankAccountSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  accountHolderName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  ifscCode: {
    type: String,
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  cancelledChequeImage: {
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

BankAccountSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Bank = mongoose.model("Bank", BankAccountSchema);

module.exports = Bank;
