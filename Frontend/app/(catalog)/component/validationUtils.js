// validationUtils.js

// Validation rules for each field type
const validationRules = {
  productCode: {
    required: true,
    pattern: /^\d{13}$/,
    message: "Product code license number must be exactly 13 digits",
  },
  productName: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: "Product name must be between 3-100 characters",
  },
  shortDescription: {
    required: true,
    minLength: 10,
    maxLength: 200,
    message: "Short description must be between 10-200 characters",
  },
  weight: {
    required: true,
    message: "Weight must be provided",
  },
  manufacturerName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: "Manufacturer name must be between 2-100 characters",
  },
  mrp: {
    required: true,
    type: "number",
    min: 0,
    message: "MRP must be a positive number",
  },
  sellingPrice: {
    required: true,
    type: "number",
    min: 0,
    message: "Selling price must be a positive number",
  },

  // Optional Fields - Validated only if a value is provided
  longDescription: {
    required: false,
    maxLength: 1000,
    message: "Long description cannot exceed 1000 characters",
  },
  countryOfOrigin: {
    required: false,
    minLength: 2,
    maxLength: 56,
    message: "Country name must be between 2-56 characters",
  },
  gstPercentage: {
    required: false,
    type: "number",
    min: 0,
    max: 100,
    message: "GST percentage must be between 0-100",
  },
  length: {
    required: false,
    type: "number",
    min: 0,
    message: "Length must be a positive number",
  },
  breadth: {
    required: false,
    type: "number",
    min: 0,
    message: "Breadth must be a positive number",
  },
  height: {
    required: false,
    type: "number",
    min: 0,
    message: "Height must be a positive number",
  },
  instructions: {
    required: false,
    maxLength: 500,
    message: "Instructions cannot exceed 500 characters",
  },
  commodityName: {
    required: false,
    maxLength: 100,
    message: "Commodity name cannot exceed 100 characters",
  },
  manufactureDate: {
    required: false,
    pattern: /^\d{2}\/\d{2}\/\d{4}$/,
    message: "Date must be in DD/MM/YYYY format",
  },
  uomUnit: {
    required: false,
    pattern: /^[a-zA-Z]+$/,
    message: "Unit must contain only letters",
  },
  uomValue: {
    required: false,
    type: "number",
    min: 0,
    message: "Unit value must be a positive number",
  },
  quantity: {
    required: false,
    type: "number",
    min: 1,
    integer: true,
    validateIfPresent: true,
    message: "Quantity must be a positive integer",
  },
  storageInstructions: {
    required: false,
    maxLength: 500,
    message: "Storage instructions cannot exceed 500 characters",
  },
  allergenInfo: {
    required: false,
    maxLength: 500,
    message: "Allergen information cannot exceed 500 characters",
  },
  fssaiCertification: {
    required: false,
    pattern: /^\d{14}$/,
    validateIfPresent: true,
    message: "FSSAI license number must be exactly 14 digits",
  },
  shelfLife: {
    required: false,
    maxLength: 100,
    message: "Shelf life information cannot exceed 100 characters",
  },
  customerCare: {
    required: false,
    maxLength: 200,
    message: "Customer care details cannot exceed 200 characters",
  },

  // Return/Cancellation Window Fields
  returnWindow: {
    required: false,
    type: "number",
    min: 1,
    integer: true,
    validateIfPresent: true,
    dependsOn: "ReturnableSetting",
    message: "Return window must be a positive number of days",
  },
  cancellationWindow: {
    required: false,
    type: "number",
    min: 1,
    integer: true,
    validateIfPresent: true,
    dependsOn: "CancellableSetting",
    message: "Cancellation window must be a positive number of days",
  },

  // Settings Fields
  ReturnableSetting: {
    required: false,
    type: "boolean",
    hasDependent: "returnWindow",
    message: "Return window is required when product is returnable",
  },
  CancellableSetting: {
    required: false,
    type: "boolean",
    hasDependent: "cancellationWindow",
    message: "Cancellation window is required when product is cancellable",
  },
  CashOnDeliverySetting: {
    required: false,
    type: "boolean",
  },
};

// Centralized error messages
const ERROR_MESSAGES = {
  REQUIRED: "This field is required",
  PRICE: "Selling price cannot be greater than MRP",
  DIMENSIONS:
    "All dimensions (length, breadth, height) must be provided together",
  RETURN_WINDOW: "Return window must be a positive number of days",
  CANCEL_WINDOW: "Cancellation window must be a positive number of days",
  REQUIRED_IMAGE: "This image is required",
  ALL_IMAGES: "Please upload all required product images",
  STOCK: "Stock must be a positive whole number",
  PROCESSING_ERROR: "Error processing image. Please try again.",
  IMAGE_UPLOAD_ERROR: "Error selecting image. Please try again.",
  DUPLICATE_PRODUCT:
    "A product with this code already exists in your inventory",
};

const validateLength = (value, min, max) => {
  const strValue = String(value).trim();
  if (min && strValue.length < min) return false;
  if (max && strValue.length > max) return false;
  return true;
};

const validatePattern = (value, pattern) => {
  return pattern.test(String(value).trim());
};

const validateNumber = (value, min, max, integer = false) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  if (integer && !Number.isInteger(num)) return false;
  return true;
};

// Core validation functions
const validateImages = (productImages) => {
  const errors = {};
  const requiredImages = ["image1", "image2", "image3"];

  requiredImages.forEach((imageKey) => {
    if (!productImages[imageKey]) {
      errors[imageKey] = ERROR_MESSAGES.REQUIRED_IMAGE;
    }
  });

  if (Object.keys(errors).length > 0) {
    errors.images = ERROR_MESSAGES.ALL_IMAGES;
  }

  return errors;
};

const validatePricing = (formData) => {
  const { mrp, sellingPrice } = formData;
  if (mrp && sellingPrice && Number(sellingPrice) > Number(mrp)) {
    return { sellingPrice: ERROR_MESSAGES.PRICE };
  }
  return {};
};

const validateDimensions = (formData) => {
  const { length, breadth, height } = formData;
  if (length || breadth || height) {
    if (!length || !breadth || !height) {
      const error = ERROR_MESSAGES.DIMENSIONS;
      return { length: error, breadth: error, height: error };
    }
  }
  return {};
};

const validateReturnsAndCancellation = (formData) => {
  const errors = {};

  if (formData.ReturnableSetting) {
    const returnWindow = Number(formData.returnWindow);
    if (!returnWindow || returnWindow <= 0 || !Number.isInteger(returnWindow)) {
      errors.returnWindow = ERROR_MESSAGES.RETURN_WINDOW;
    }
  }

  if (formData.CancellableSetting) {
    const cancellationWindow = Number(formData.cancellationWindow);
    if (
      !cancellationWindow ||
      cancellationWindow <= 0 ||
      !Number.isInteger(cancellationWindow)
    ) {
      errors.cancellationWindow = ERROR_MESSAGES.CANCEL_WINDOW;
    }
  }

  return errors;
};

const validateField = (field, value, formData = {}) => {
  const rules = validationRules[field];
  if (!rules) return null;

  const normalizedValue = value === "" ? null : value;

  // Required field check
  if (rules.required && !normalizedValue) {
    return ERROR_MESSAGES.REQUIRED;
  }

  // Skip validation for empty optional fields
  if (!normalizedValue && !rules.required) {
    return null;
  }

  // Validate non-empty values
  if (normalizedValue) {
    if (
      rules.type === "number" &&
      !validateNumber(normalizedValue, rules.min, rules.max, rules.integer)
    ) {
      return rules.message;
    }

    if (
      (rules.minLength || rules.maxLength) &&
      !validateLength(normalizedValue, rules.minLength, rules.maxLength)
    ) {
      return rules.message;
    }

    if (rules.pattern && !validatePattern(normalizedValue, rules.pattern)) {
      return rules.message;
    }
  }

  return null;
};

// Scroll helper
const scrollToError = (fieldName, fieldRefs, scrollViewRef) => {
  const fieldRef = fieldRefs.current[fieldName];
  if (fieldRef && scrollViewRef.current) {
    fieldRef.measureLayout(
      scrollViewRef.current,
      (x, y) => {
        scrollViewRef.current.scrollTo({
          y: y - 100,
          animated: true,
        });
      },
      () => console.log("Failed to measure")
    );
  }
};

// Form validation hook
const useFormValidation = (
  formData,
  productImages,
  setErrors,
  fieldRefs,
  scrollViewRef
) => {
  // Handle individual field validation
  const validateSingleField = (field, value) => {
    const currentFormData = { ...formData, [field]: value };
    const errors = {};

    // Basic field validation
    const fieldError = validateField(field, value);
    if (fieldError) errors[field] = fieldError;

    // Related validations
    const pricingErrors = validatePricing(currentFormData);
    const dimensionErrors = validateDimensions(currentFormData);
    const policyErrors = validateReturnsAndCancellation(currentFormData);

    Object.assign(errors, pricingErrors, dimensionErrors, policyErrors);

    setErrors((prev) => ({
      ...prev,
      ...errors,
    }));

    return Object.keys(errors).length === 0;
  };

  // Handle form submission validation
  const validateAllFields = () => {
    const errors = {};

    // Validate all individual fields
    Object.keys(formData).forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      if (fieldError) errors[field] = fieldError;
    });

    // Cross-field validations
    const pricingErrors = validatePricing(formData);
    const dimensionErrors = validateDimensions(formData);
    const policyErrors = validateReturnsAndCancellation(formData);
    const imageErrors = validateImages(productImages);

    Object.assign(
      errors,
      pricingErrors,
      dimensionErrors,
      policyErrors,
      imageErrors
    );

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      scrollToError(Object.keys(errors)[0], fieldRefs, scrollViewRef);
      return false;
    }

    return true;
  };

  return {
    validateSingleField,
    validateAllFields,
  };
};

export { validateField, validateImages, useFormValidation, ERROR_MESSAGES };
