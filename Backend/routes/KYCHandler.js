const express = require("express");
const {
  submitKYCDetails,
  getKYCDetails,
} = require("../controllers/KYCController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/submit", authenticate, submitKYCDetails);
router.get("/details", authenticate, getKYCDetails);
//router.put("/:id", authenticate, updateKYCDetails);

module.exports = router;
