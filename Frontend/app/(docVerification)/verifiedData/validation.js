const validateKYCForm = (formData) => {
  const errors = {};
  let isValid = true;

  if (!formData.storeName?.trim()) {
    errors.storeName = "Store name is required";
    isValid = false;
  }

  if (!formData.address?.trim()) {
    errors.address = "Registered address is required";
    isValid = false;
  }

  if (!formData.email?.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!formData.email?.includes("@")) {
    errors.email = "Please enter a valid email";
    isValid = false;
  }

  if (!formData.mobile) {
    errors.mobile = "Mobile number is required";
    isValid = false;
  } else {
    const mobileString = formData.mobile.toString();
    if (mobileString.length !== 10 || isNaN(formData.mobile)) {
      errors.mobile = "Please enter a valid 10-digit mobile number";
      isValid = false;
    }
  }

  if (!formData.panNumber?.trim()) {
    errors.panNumber = "PAN number is required";
    isValid = false;
  } else if (formData.panNumber.trim().length !== 10) {
    errors.panNumber = "Please enter a valid PAN number";
    isValid = false;
  }

  if (!formData.gstin?.trim()) {
    errors.gstin = "GSTIN is required";
    isValid = false;
  }

  if (!formData.fssaiNumber) {
    errors.fssaiNumber = "FSSAI number is required";
    isValid = false;
  } else {
    const fssaiString = formData.fssaiNumber.toString();
    if (fssaiString.length !== 14) {
      errors.fssaiNumber = "FSSAI number must be exactly 14 characters";
      isValid = false;
    }
  }

  return { isValid, errors };
};

const validateBankDetails = (formData) => {
  const errors = {};
  let isValid = true;

  if (!formData.accountHolderName?.trim()) {
    errors.accountHolderName = "Account Holder Name is required";
    isValid = false;
  }

  if (!formData.accountNumber?.trim()) {
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

  if (!formData.bankName?.trim()) {
    errors.bankName = "Bank Name is required";
    isValid = false;
  }

  if (!formData.branchName?.trim()) {
    errors.branchName = "Branch Name is required";
    isValid = false;
  }

  if (!formData.ifscCode?.trim()) {
    errors.ifscCode = "IFSC Code is required";
    isValid = false;
  } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
    errors.ifscCode = "IFSC Code must be in the format ABCD0123456";
    isValid = false;
  }

  return { isValid, errors };
};

export { validateKYCForm, validateBankDetails };
