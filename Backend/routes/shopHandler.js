const express = require('express');
const {
    registerShop,
    getShopById,
    updateShop,
    deleteShop,
} = require('../controllers/shopController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register',authenticate, registerShop);
router.get('/:id', authenticate, getShopById);
router.put('/:id', authenticate, updateShop);
router.delete('/:id', authenticate, deleteShop);

module.exports = router;