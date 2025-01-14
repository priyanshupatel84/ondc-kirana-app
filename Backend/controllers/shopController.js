const validator = require("validator");
const Shop = require("../models/Shop");
// Helper function to validate shop data
const validateShopData = (data) => {
  const errors = [];

  if (!data.name || !validator.isLength(data.name, { min: 3, max: 50 })) {
    errors.push("Shop name must be between 3 and 50 characters.");
  }
  if (
    !data.address ||
    !validator.isLength(data.address, { min: 10, max: 200 })
  ) {
    errors.push("Address must be between 10 and 200 characters.");
  }
  if (data.support_email && !validator.isEmail(data.support_email)) {
    errors.push("Invalid support email address.");
  }
  if (data.phone && !validator.isMobilePhone(data.phone, "any")) {
    errors.push("Invalid phone number.");
  }
  if (data.shop_logo_url && !validator.isURL(data.shop_logo_url)) {
    errors.push("Invalid shop logo URL.");
  }
  if (
    data.supported_products &&
    (!Array.isArray(data.supported_products) ||
      data.supported_products.some((p) => typeof p !== "string"))
  ) {
    errors.push("Supported products must be an array of strings.");
  }

  return errors;
};

// Register a new shop
// exports.registerShop = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { name, address, support_email, phone, supported_products, shop_logo_url } = req.body;

//         const validationErrors = validateShopData({ name, address, support_email, phone, supported_products, shop_logo_url });
//         if (validationErrors.length > 0) {
//             return res.status(400).json({ errors: validationErrors });
//         }

//         const shop = await Shop.create({ userId, name, address, support_email, phone, supported_products, shop_logo_url });
//         res.status(201).json({ message: 'Shop registered successfully!', shop });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
// Register a new shop

exports.registerShop = async (req, res) => {
  const userId = req.user?.id;

  const {
    name,
    logo,
    location,
    city,
    pinCode,
    state,
    country,
    supportEmail,
    supportMobile,
    isLiveShop,
    openingTime,
    closingTime,
    productCategories,
    locationAvailability,
    customRadius,
    defaultCancellableSetting,
    defaultReturnableSetting,
  } = req.body;

  try {
    const shop = await Shop.create({
      userId,
      name,
      logo,
      location,
      city,
      pinCode,
      state,
      country,
      supportEmail,
      supportMobile,
      isLiveShop,
      openingTime,
      closingTime,
      productCategories,
      locationAvailability,
      customRadius,
      defaultCancellableSetting,
      defaultReturnableSetting,
    });

    return res
      .status(201)
      .json({ message: "Shop registered successfully!", shop });
  } catch (error) {
    console.error("Error registering shop:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update shop details
exports.updateShop = async (req, res) => {
  const userId = req.user?.id;
  try {
    const { id } = req.params;
    const {
      name,
      logo,
      location,
      city,
      pinCode,
      state,
      country,
      supportEmail,
      supportMobile,
      isLiveShop,
      openingTime,
      closingTime,
      productCategories,
      locationAvailability,
      customRadius,
      defaultCancellableSetting,
      defaultReturnableSetting,
    } = req.body;

    // Find the shop by ID
    const shop = await Shop.findById(id);
    console.log("shop", shop);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Check if the user is authorized to update this shop
    if (shop.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to update this shop.",
      });
    }

    // Update the shop fields only if they are provided
    if (name !== undefined) shop.name = name;
    if (logo !== undefined) shop.name = name;
    if (location !== undefined) shop.location = location;
    if (city !== undefined) shop.city = city;
    if (pinCode !== undefined) shop.pinCode = pinCode;
    if (state !== undefined) shop.state = state;
    if (country !== undefined) shop.country = country;
    if (supportEmail !== undefined) shop.supportEmail = supportEmail;
    if (supportMobile !== undefined) shop.supportMobile = supportMobile;
    if (isLiveShop !== undefined) shop.isLiveShop = isLiveShop;
    if (openingTime !== undefined) shop.openingTime = openingTime;
    if (closingTime !== undefined) shop.closingTime = closingTime;
    if (productCategories !== undefined)
      shop.productCategories = productCategories;
    if (locationAvailability !== undefined)
      shop.locationAvailability = locationAvailability;
    if (customRadius !== undefined) shop.customRadius = customRadius;
    if (defaultCancellableSetting !== undefined)
      shop.defaultCancellableSetting = defaultCancellableSetting;
    if (defaultReturnableSetting !== undefined)
      shop.defaultReturnableSetting = defaultReturnableSetting;

    await shop.save();

    res.status(200).json({ message: "Shop updated successfully!", shop });
  } catch (error) {
    console.error("Error updating shop:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete a shop
exports.deleteShop = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    await Shop.findByIdAndDelete(id);
    res.json({ message: "Shop deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get shop details by ID
exports.getShopById = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(shop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
