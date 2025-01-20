const messages = (t) => ({
  formLabels: {
    name: t("Shop Name"),
    location: t("Shop Location"),
    city: t("City"),
    pinCode: t("PIN Code"),
    state: t("State"),
    country: t("Country"),
    supportEmail: t("Support Email"),
    supportMobile: t("Support Mobile Number"),
    productCategories: t("Supported Product Categories"),
    deliveryRadius: t("Delivery Radius (in km)"),
    liveShopStatus: t("Live Shop Status"),
    shopHours: t("Shop Hours"),
    openingTime: t("Opening Time"),
    closingTime: t("Closing Time"),
  },

  formPlaceholder: {
    name: "Enter Shop Name",
    supportEmail: "Enter Support Email",
    supportMobile: "Enter Support Mobile Number",
    productCategories: "Enter Supported Product Categories",
    location: "Search location!",
    country: "Enter Country",
    state: "Enter State",
    city: "Enter City",
    pinCode: "Enter PIN Code",
    deliveryRadius: "Enter Delivery Radius",
    openingTime: "00:00 AM",
    closingTime: "00:00 PM",
  },

  locationOptions: [
    { value: "PAN India", label: t("PAN India") },
    { value: "City", label: t("City Only") },
    { value: "Custom", label: t("Custom Area") },
  ],

  shopStatus: {
    live: t("Your shop is visible to customers"),
    offline: t("Your shop is hidden from customers"),
  },

  validationMessages: {
    required: t("This field is required"),
    invalidEmail: t("Invalid email format"),
    invalidMobile: t("Invalid mobile number format"),
    cityRequired: t("City is required for city-specific availability"),
    deliveryRadiusRequired: t("Delivery radius is required"),
    buildingRequired: t("Building/Street is required"),
    localityRequired: t("Locality is required"),
    pinCodeRequired: t("PIN code is required"),
  },

  alerts: {
    validationError: t("Validation Error"),
    checkFields: t("Please check all required fields"),
    success: t("Success"),
    storeSaved: t("Store configuration saved successfully"),
    error: t("Error"),
    saveFailed: t("Failed to save store configuration. Please try again."),
    saving: t("Saving"),
    saveConfiguration: t("Save Configuration"),
    ok: t("OK"),
  },
});

export default messages;
