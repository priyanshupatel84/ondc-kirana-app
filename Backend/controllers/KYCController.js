const validator = require("validator");
const KYC = require("../models/KYC"); // Assuming the KYC model is in the models directory
const User = require("../models/User"); // Assuming the User model is in the models directory

const validateKYCData = (data) => {
  const errors = [];

  if (data.email && !validator.isEmail(data.email)) {
    errors.push("Invalid email format.");
  }
  if (data.mobile && !validator.isMobilePhone(data.mobile.toString(), "any")) {
    errors.push("Invalid mobile number.");
  }
  if (
    data.fssaiNumber &&
    !validator.isLength(data.fssaiNumber.toString(), { min: 14, max: 14 })
  ) {
    errors.push("FSSAI number must be exactly 14 characters.");
  }
  if (
    data.address &&
    !validator.isLength(data.address, { min: 10, max: 200 })
  ) {
    errors.push("Address must be between 10 and 200 characters.");
  }

  return errors;
};

// Submit KYC Details
exports.submitKYCDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      storeName,
      address,
      email,
      mobile,
      panNumber,
      gstin,
      fssaiNumber,
      panCard,
      aadhaarCard,
      gstinCertificate,
      addressProof,
    } = req.body;

    // Validate input data
    const validationErrors = validateKYCData({
      address,
      email,
      mobile,
      fssaiNumber,
    });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isDocumentVerified: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User  not found" });
    }

    const kyc = await KYC.create({
      userId,
      storeName,
      address,
      email,
      mobile,
      panNumber,
      gstin,
      fssaiNumber,
      panCard,
      aadhaarCard,
      gstinCertificate,
      addressProof,
    });

    res.status(201).json({
      message: "KYC Details submitted successfully!",
      kyc,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error submitting KYC details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting KYC details." });
  }
};

// Update KYC Details
exports.updateKYCDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      mob_no,
      fssai_no,
      address,
      idType,
      idNumber,
      id_image_url,
      gstin_certificate_url,
    } = req.body;

    // Validate input data
    const validationErrors = validateKYCData({
      email,
      mob_no,
      fssai_no,
      address,
      idType,
      idNumber,
      id_image_url,
      gstin_certificate_url,
    });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const kyc = await KYC.findById(id);
    if (!kyc) {
      return res.status(404).json({ message: "KYC details not found" });
    }

    if (kyc.status === "Pending" || kyc.status === "Rejected") {
      if (email) kyc.email = email;
      if (mob_no) kyc.mob_no = mob_no;
      if (fssai_no) kyc.fssai_no = fssai_no;
      if (address) kyc.address = address;
      if (idType) kyc.idType = idType;
      if (idNumber) kyc.idNumber = idNumber;
      if (id_image_url) kyc.id_image_url = id_image_url;
      if (gstin_certificate_url)
        kyc.gstin_certificate_url = gstin_certificate_url;

      await kyc.save();
      res.json({ message: "KYC details updated successfully!", kyc });
    } else {
      res
        .status(400)
        .json({ message: "Status is Verified: Cannot Modify Details" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get KYC Details by ID
exports.getKYCDetails = async (req, res) => {
  try {
    const kyc = await KYC.findOne({ userId: req.user.id });
    res.json({ success: true, kyc });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch KYC details" });
  }
};
