const express = require('express');
const {
    addBankAccountDetails,
    getBankAccountDetails,
    updateBankAccountDetails
} = require('../controllers/bankController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add',authenticate, addBankAccountDetails);
router.get('/:id', authenticate, getBankAccountDetails);
router.put('/:id', authenticate, updateBankAccountDetails);

module.exports = router;