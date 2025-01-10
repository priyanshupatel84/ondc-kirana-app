const Bank = require('../models/Bank'); // Assuming the Shop model is in the models directory


// add bank account details
exports.addBankAccountDetails = async (req, res) => {
    try {
        const userId=req.user.id;
        const { accountHolderName, accountNumber, bankName, ifscCode, branchName, cancelled_cheque_url } = req.body;

        const bank = await Bank.create({userId, accountHolderName, accountNumber, bankName, ifscCode, branchName, cancelled_cheque_url});
        res.status(201).json({ message: 'Bank details added successfully!', bank });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update bank details
exports.updateBankAccountDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountHolderName, accountNumber, bankName, ifscCode, branchName, cancelled_cheque_url } = req.body;
        const bank = await Bank.findById(id);

        if (!bank) {
            return res.status(404).json({ message: 'Bank Account not found' });
        }

        if (accountHolderName) bank.accountHolderName = accountHolderName;
        if (accountNumber) bank.accountNumber = accountNumber;
        if (bankName) bank.bankName = bankName;
        if (ifscCode) bank.ifscCode = ifscCode;
        if (branchName) bank.branchName = branchName;
        if (cancelled_cheque_url) bank.cancelled_cheque_url = cancelled_cheque_url

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