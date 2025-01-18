const express = require("express");
const {
  addProduct,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/groceryController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add-product", authenticate, addProduct);
router.get("/:id", authenticate, getProduct);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

module.exports = router;
