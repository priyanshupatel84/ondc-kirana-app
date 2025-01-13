const validateKYCDocuments = (uploadedDocuments) => {
  const errors = {};
  let isValid = true;

  // Check if each required document is uploaded
  if (!uploadedDocuments.addressProof) {
    errors.addressProof = "Address Proof is required";
    isValid = false;
  }

  if (!uploadedDocuments.idProof) {
    errors.idProof = "ID Proof is required";
    isValid = false;
  }

  if (!uploadedDocuments.panCard) {
    errors.panCard = "PAN Card Image is required";
    isValid = false;
  }

  if (!uploadedDocuments.gstinCertificate) {
    errors.gstinCertificate = "GSTIN Certificate is required";
    isValid = false;
  }

  return { isValid, errors };
};

const validateKYCForm = (formData) => {
  const errors = {};
  let isValid = true;

  // Store Name validation
  if (!formData.storeName.trim()) {
    errors.storeName = "Store name is required";
    isValid = false;
  }

  // Registered Address validation
  if (!formData.registeredAddress.trim()) {
    errors.registeredAddress = "Registered address is required";
    isValid = false;
  }

  // Email validation
  if (!formData.email.includes("@")) {
    errors.email = "Please enter a valid email";
    isValid = false;
  }

  // Mobile validation
  if (formData.mobile.trim().length !== 10 || isNaN(formData.mobile)) {
    errors.mobile = "Please enter a valid 10-digit mobile number";
    isValid = false;
  }

  // PAN validation
  if (formData.pan.trim().length !== 10) {
    errors.pan = "Please enter a valid PAN number";
    isValid = false;
  }

  // GSTIN validation
  if (formData.gstin.trim() === "") {
    errors.gstin = "GSTIN is required";
    isValid = false;
  }

  // FSSAI Number validation
  if (formData.fssaiNumber.trim() === "") {
    errors.fssaiNumber = "FSSAI number is required";
    isValid = false;
  }

  return { isValid, errors };
};

const validateBankDetails = (formData) => {
  const errors = {};
  let isValid = true;

  // Account Holder Name validation
  if (!formData.accountHolderName.trim()) {
    errors.accountHolderName = "Account Holder Name is required";
    isValid = false;
  }

  // Account Number validation
  if (!formData.accountNumber.trim()) {
    errors.accountNumber = "Account Number is required";
    isValid = false;
  } else if (!/^\d+$/.test(formData.accountNumber)) {
    errors.accountNumber = "Account Number must be numeric";
    isValid = false;
  } else if (
    formData.accountNumber.length < 11 ||
    formData.accountNumber.length > 14
  ) {
    errors.accountNumber =
      "Account Number must be between 11 and 14 digits long";
    isValid = false;
  }

  // Bank Name validation
  if (!formData.bankName.trim()) {
    errors.bankName = "Bank Name is required";
    isValid = false;
  }

  // Branch Name validation
  if (!formData.branchName.trim()) {
    errors.branchName = "Branch Name is required";
    isValid = false;
  }

  // IFSC Code validation
  if (!formData.ifscCode.trim()) {
    errors.ifscCode = "IFSC Code is required";
    isValid = false;
  } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
    errors.ifscCode = "IFSC Code must be in the format ABCD0123456";
    isValid = false;
  }

  return { isValid, errors };
};

export { validateKYCDocuments, validateKYCForm, validateBankDetails };
