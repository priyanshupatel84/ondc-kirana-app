const Shop = require("../models/Shop");
const User = require("../models/User");

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

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isShopSetuped: true },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User  not found" });
    }

    return res.status(201).json({
      message: "Shop registered successfully!",
      shop,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error registering shop:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update shop details
exports.updateShop = async (req, res) => {
  const userId = req.user?.id;
  try {
    const {
      isLiveShop,
      openingTime,
      closingTime,
      productCategories,
      locationAvailability,
      customRadius,
      defaultCancellableSetting,
      defaultReturnableSetting,
    } = req.body;

    // Find the shop by userId instead of shop ID
    const shop = await Shop.findOne({ userId });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Update the shop fields only if they are provided
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

    res.status(200).json({
      message: "Shop updated successfully!",
      shop,
    });
  } catch (error) {
    console.error("Error updating shop:", error);
    res.status(400).json({
      message: "Failed to update shop",
      error: error.message,
    });
  }
};

// Get shop details
exports.getShopDetails = async (req, res) => {
  const userId = req.user?.id;

  try {
    const shop = await Shop.findOne({ userId });

    if (!shop) {
      return res.status(404).json({
        success: false,
        error: "Shop not found",
      });
    }

    return res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    console.error("Error fetching shop details:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// // Delete a shop
// exports.deleteShop = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const shop = await Shop.findById(id);
//     if (!shop) {
//       return res.status(404).json({ message: "Shop not found" });
//     }

//     await Shop.findByIdAndDelete(id);
//     res.json({ message: "Shop deleted successfully!" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
