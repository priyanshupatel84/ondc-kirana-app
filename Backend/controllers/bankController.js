const validator = require("validator");
const Bank = require("../models/Bank");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to validate bank account data
const validateBankData = (data) => {
  const errors = [];

  if (
    data.accountHolderName &&
    !validator.isLength(data.accountHolderName, { min: 3, max: 100 })
  ) {
    errors.push("Account holder name must be between 3 and 100 characters.");
  }
  if (
    data.accountNumber &&
    (!validator.isNumeric(data.accountNumber) ||
      !validator.isLength(data.accountNumber, { min: 9, max: 18 }))
  ) {
    errors.push("Account number must be numeric and between 9 to 18 digits.");
  }
  if (
    data.bankName &&
    !validator.isLength(data.bankName, { min: 3, max: 100 })
  ) {
    errors.push("Bank name must be between 3 and 100 characters.");
  }
  if (data.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifscCode)) {
    errors.push("Invalid IFSC code format.");
  }
  if (
    data.branchName &&
    !validator.isLength(data.branchName, { min: 3, max: 100 })
  ) {
    errors.push("Branch name must be between 3 and 100 characters.");
  }

  return errors;
};

// Add bank account details
// exports.addBankAccountDetails = async (req, res) => {
//   try {
//     const { user } = req;
//     const userId = req.user.id;
//     user.isBankDetailsVerified = true;
//     const {
//       accountHolderName,
//       accountNumber,
//       ifscCode,
//       bankName,
//       branchName,
//       cancelledChequeImage,
//     } = req.body;

//     // Validate input data
//     const validationErrors = validateBankData({
//       accountHolderName,
//       accountNumber,
//       ifscCode,
//       bankName,
//       branchName,
//     });
//     if (validationErrors.length > 0) {
//       return res.status(400).json({ errors: validationErrors });
//     }

//     const bank = await Bank.create({
//       userId,
//       accountHolderName,
//       accountNumber,
//       bankName,
//       ifscCode,
//       branchName,
//       cancelledChequeImage,
//     });
//     res.status(201).json({
//       message: "Bank details added successfully!",
//       bank,
//       user,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.addBankAccountDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      branchName,
      cancelledChequeImage,
    } = req.body;

    // Validate input data
    const validationErrors = validateBankData({
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      branchName,
    });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Create a new bank record
    const bank = await Bank.create({
      userId,
      accountHolderName,
      accountNumber,
      bankName,
      ifscCode,
      branchName,
      cancelledChequeImage,
    });

    res.status(201).json({
      message: "Bank details added successfully!",
      bank,
    });
  } catch (error) {
    console.error("Error adding bank account details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update bank account details
exports.updateBankAccountDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      accountHolderName,
      accountNumber,
      bankName,
      ifscCode,
      branchName,
      cancelled_cheque_url,
    } = req.body;

    // Validate input data
    const validationErrors = validateBankData({
      accountHolderName,
      accountNumber,
      bankName,
      ifscCode,
      branchName,
      cancelled_cheque_url,
    });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const bank = await Bank.findById(id);
    if (!bank) {
      return res.status(404).json({ message: "Bank Account not found" });
    }

    if (accountHolderName) bank.accountHolderName = accountHolderName;
    if (accountNumber) bank.accountNumber = accountNumber;
    if (bankName) bank.bankName = bankName;
    if (ifscCode) bank.ifscCode = ifscCode;
    if (branchName) bank.branchName = branchName;
    if (cancelled_cheque_url) bank.cancelled_cheque_url = cancelled_cheque_url;

    await bank.save();
    res.json({ message: "Bank details updated successfully!", bank });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get bank account details by ID
exports.getBankAccountDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const bank = await Bank.findById(id);
    if (!bank) {
      return res.status(404).json({ message: "Bank Account not found" });
    }

    res.json(bank);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
