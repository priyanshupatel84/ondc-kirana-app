const express = require("express");
const {
  registerShop,
  getShopDetails,
  updateShop,
} = require("../controllers/shopController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", authenticate, registerShop);
router.get("/details", authenticate, getShopDetails);
router.patch("/update", authenticate, updateShop);

//router.delete("/:id", authenticate, deleteShop);

module.exports = router;
