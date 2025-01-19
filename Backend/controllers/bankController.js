const validator = require("validator");
const Bank = require("../models/Bank");

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

    // Update the bank record
    const bank = await Bank.findOneAndUpdate(
      { userId },
      {
        accountHolderName,
        accountNumber,
        bankName,
        ifscCode,
        branchName,
        cancelledChequeImage,
      },
      { new: true }
    );

    if (!bank) {
      return res.status(404).json({ error: "Bank details not found" });
    }

    res.status(200).json({
      message: "Bank details updated successfully!",
      bank,
    });
  } catch (error) {
    console.error("Error updating bank account details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get bank account details by ID
exports.getBankAccountDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const bankDetails = await Bank.findOne({ userId });

    if (!bankDetails) {
      return res.status(404).json({ error: "Bank details not found" });
    }

    res.status(200).json({
      success: true,
      bankDetails,
    });
  } catch (error) {
    console.error("Error fetching bank account details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
