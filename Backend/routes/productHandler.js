const express = require("express");
const {
  addProduct,
  getInventoryProducts,
  updateProduct,
  getProductById,
} = require("../controllers/ProductController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add-product", authenticate, addProduct);
router.get("/inventory", authenticate, getInventoryProducts);
router.put("/edit/:id", authenticate, updateProduct);
router.get("/:id", authenticate, getProductById);

module.exports = router;
