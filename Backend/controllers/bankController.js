const validator = require('validator');
const Bank = require('../models/Bank');

// Helper function to validate bank account data
const validateBankData = (data) => {
    const errors = [];

    if (data.accountHolderName && !validator.isLength(data.accountHolderName, { min: 3, max: 100 })) {
        errors.push('Account holder name must be between 3 and 100 characters.');
    }
    if (data.accountNumber && (!validator.isNumeric(data.accountNumber) || !validator.isLength(data.accountNumber, { min: 9, max: 18 }))) {
        errors.push('Account number must be numeric and between 9 to 18 digits.');
    }
    if (data.bankName && !validator.isLength(data.bankName, { min: 3, max: 100 })) {
        errors.push('Bank name must be between 3 and 100 characters.');
    }
    if (data.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifscCode)) {
        errors.push('Invalid IFSC code format.');
    }
    if (data.branchName && !validator.isLength(data.branchName, { min: 3, max: 100 })) {
        errors.push('Branch name must be between 3 and 100 characters.');
    }
    if (data.cancelled_cheque_url && !validator.isURL(data.cancelled_cheque_url)) {
        errors.push('Invalid cancelled cheque URL.');
    }

    return errors;
};

// Add bank account details
exports.addBankAccountDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { accountHolderName, accountNumber, bankName, ifscCode, branchName, cancelled_cheque_url } = req.body;

        // Validate input data
        const validationErrors = validateBankData({ accountHolderName, accountNumber, bankName, ifscCode, branchName, cancelled_cheque_url });
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        const bank = await Bank.create({ userId, accountHolderName, accountNumber, bankName, ifscCode, branchName, cancelled_cheque_url });
        res.status(201).json({ message: 'Bank details added successfully!', bank });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update bank account details
exports.updateBankAccountDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountHolderName, accountNumber, bankName, ifscCode, branchName, cancelled_cheque_url } = req.body;

        // Validate input data
        const validationErrors = validateBankData({ accountHolderName, accountNumber, bankName, ifscCode, branchName, cancelled_cheque_url });
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        const bank = await Bank.findById(id);
        if (!bank) {
            return res.status(404).json({ message: 'Bank Account not found' });
        }

        if (accountHolderName) bank.accountHolderName = accountHolderName;
        if (accountNumber) bank.accountNumber = accountNumber;
        if (bankName) bank.bankName = bankName;
        if (ifscCode) bank.ifscCode = ifscCode;
        if (branchName) bank.branchName = branchName;
        if (cancelled_cheque_url) bank.cancelled_cheque_url = cancelled_cheque_url;

        await bank.save();
        res.json({ message: 'Bank details updated successfully!', bank });
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
            return res.status(404).json({ message: 'Bank Account not found' });
        }

        res.json(bank);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
