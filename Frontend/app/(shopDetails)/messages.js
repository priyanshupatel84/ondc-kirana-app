// messages.js
const messages = (t) => ({
  formLabels: {
    supportEmail: t("Support Email"),
    supportMobile: t("Support Mobile Number"),
    productCategories: t("Supported Product Categories"),
    storeLocation: t("Store Location"),
    country: t("Country"),
    state: t("State"),
    city: t("City"),
    building: t("Building"),
    pinCode: t("PIN Code"),
    locality: t("Locality"),
    deliveryRadius: t("Delivery Radius (in km)"),
    liveShopStatus: t("Live Shop Status"),
    shopHours: t("Shop Hours"),
    openingTime: t("Opening Time"),
    closingTime: t("Closing Time"),
  },

  formPlaceholder: {
    supportEmail: t("Enter Support Email"),
    supportMobile: t("Enter Support Mobile Number"),
    productCategories: t("Enter Supported Product Categories"),
    storeLocation: t("Search location!"),
    country: t("Enter Country"),
    state: t("Enter State"),
    city: t("Enter City"),
    building: t("Enter Building"),
    pinCode: t("Enter PIN Code"),
    locality: t("Enter Locality"),
    deliveryRadius: t("Enter Delivery Radius"),
    openingTime: t("Select Opening Time"),
    closingTime: t("Select Closing Time"),
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
});

export default messages;
