// const validateKYCForm = (formData) => {
//   const errors = {};
//   let isValid = true;

//   // Store Name validation
//   if (!formData.storeName?.trim()) {
//     errors.storeName = "Store name is required";
//     isValid = false;
//   }

//   // Registered Address validation
//   if (!formData.registeredAddress?.trim()) {
//     errors.registeredAddress = "Registered address is required";
//     isValid = false;
//   }

//   // Email validation
//   if (!formData.email?.includes("@")) {
//     errors.email = "Please enter a valid email";
//     isValid = false;
//   }

//   // Mobile validation
//   if (!formData.mobile) {
//     errors.mobile = "Mobile number is required";
//     isValid = false;
//   } else {
//     const mobileString = formData.mobile.toString();
//     if (mobileString.length !== 10 || isNaN(formData.mobile)) {
//       errors.mobile = "Please enter a valid 10-digit mobile number";
//       isValid = false;
//     }
//   }

//   // PAN validation
//   if (!formData.pan?.trim()) {
//     errors.pan = "PAN number is required";
//     isValid = false;
//   } else if (formData.pan.trim().length !== 10) {
//     errors.pan = "Please enter a valid PAN number";
//     isValid = false;
//   }

//   // GSTIN validation
//   if (!formData.gstin?.trim()) {
//     errors.gstin = "GSTIN is required";
//     isValid = false;
//   }

//   // FSSAI Number validation
//   if (!formData.fssaiNumber) {
//     errors.fssaiNumber = "FSSAI number is required";
//     isValid = false;
//   } else {
//     const fssaiString = formData.fssaiNumber.toString();
//     if (fssaiString.trim() === "") {
//       errors.fssaiNumber = "FSSAI number is required";
//       isValid = false;
//     }
//   }

//   return { isValid, errors };
// };

const validateKYCForm = (formData) => {
  const errors = {};
  let isValid = true;

  // Store Name validation
  if (!formData.storeName?.trim()) {
    errors.storeName = "Store name is required";
    isValid = false;
  }

  // Address validation (changed from registeredAddress)
  if (!formData.address?.trim()) {
    errors.address = "Registered address is required";
    isValid = false;
  }

  // Email validation
  if (!formData.email?.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!formData.email?.includes("@")) {
    errors.email = "Please enter a valid email";
    isValid = false;
  }

  // Mobile validation
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

  // PAN validation (changed from pan to panNumber)
  if (!formData.panNumber?.trim()) {
    errors.panNumber = "PAN number is required";
    isValid = false;
  } else if (formData.panNumber.trim().length !== 10) {
    errors.panNumber = "Please enter a valid PAN number";
    isValid = false;
  }

  // GSTIN validation
  if (!formData.gstin?.trim()) {
    errors.gstin = "GSTIN is required";
    isValid = false;
  }

  // FSSAI validation
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

  // Account Holder Name validation
  if (!formData.accountHolderName?.trim()) {
    errors.accountHolderName = "Account Holder Name is required";
    isValid = false;
  }

  // Account Number validation
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

  // Bank Name validation
  if (!formData.bankName?.trim()) {
    errors.bankName = "Bank Name is required";
    isValid = false;
  }

  // Branch Name validation
  if (!formData.branchName?.trim()) {
    errors.branchName = "Branch Name is required";
    isValid = false;
  }

  // IFSC Code validation
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
