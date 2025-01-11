const express = require('express');
const {
    submitKYCDetails,
    getKYCDetails,
    updateKYCDetails
} = require('../controllers/KYCController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/submit',authenticate, submitKYCDetails);
router.get('/:id', authenticate, getKYCDetails);
router.put('/:id', authenticate, updateKYCDetails);

module.exports = router;