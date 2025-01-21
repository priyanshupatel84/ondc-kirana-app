const Shop = require("../models/Shop.js");
const User = require("../models/User.js");
const Bank = require("../models/Bank.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { translateText } = require("./df_translator.js");
const KYC = require("../models/KYC.js"); // Make sure to create this model
const Product = require("../models/Product.js"); // Make sure to create this model

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const defaultWelcomeMessage = async (req, res) => {
  const userQuery = req.body.query;
  const { lang } = req.params;

  try {
    const prompt = `You are a customer support expert. You are tasked to provide a welcome message to the user: ${userQuery}.
    Please provide a friendly and welcoming message.
    `;

    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text();
    console.log("Gemini Response:", geminiResponse);

    const cleanResponse = geminiResponse.replace(
      /[*\/\-\+\%\$#\(\)\{\}\[\]~]/g,
      ""
    );
    const response = await translateText(cleanResponse, lang);
    return res.status(200).send(response);
  } catch (error) {
    const response = await translateText(
      "Sorry, there was an error processing your request.",
      lang
    );
    return res.status(500).send(response);
  }
};

const handleFunctionalities = async (req, res) => {
  const { userId, lang } = req.params;
  const userQuery = req.body.query;

  try {
    const prompt = `You are a helpful assistant designed to guide users on navigating the app features efficiently. 
    User Query: "${userQuery}"

    Provide navigation instructions based on these features:
    1. Update Bank Details: Profile section -> 'Bank Account Edit' button
    2. View Orders: Click 'Order' icon
    3. Add Products: Home page -> 'Add Product' icon -> select category -> add details
    4. Manage Inventory: Home page -> 'Inventory' icon
    5. View Customer Complaints: Home page -> 'Support' icon
    6. Update Shop Settings: Home page -> 'Shop Settings' icon
    7. To See Daily Sales Report: Home page -> 'Today's Performance' Bar

    All the four icons (Home, Order, Chat Bot, Profile) are located in the bottom navigation bar.
    Respond Only with the details that is asked by the user.
    Please provide clear, step-by-step instructions in a friendly tone.
    If the query doesn't match any feature, provide a general overview of the main features.`;

    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text();

    // Clean the response of special characters
    const cleanResponse = geminiResponse.replace(
      /[*\/\-\+\%\$#\(\)\{\}\[\]~]/g,
      ""
    );

    // Translate the response to user's preferred language
    const response = await translateText(cleanResponse, lang);
    return res.status(200).send(response);
  } catch (error) {
    console.error("Error in handleFunctionalities:", error);
    const errorMessage = await translateText(
      "Sorry, I couldn't help with app navigation at the moment. Please try again.",
      lang
    );
    return res.status(500).send(errorMessage);
  }
};

const handleShopQuery = async (req, res) => {
  const { userId } = req.params;
  const { lang } = req.params;
  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const response = await translateText("Invalid user ID format", lang);
      return res.status(400).send(response);
    }

    // Find all shops for the user
    const shops = await Shop.find({
      userId: userId,
    }).exec();

    if (!shops || shops.length === 0) {
      const response = await translateText(
        "You don't have any shops registered yet.",
        lang
      );
      return res.status(200).send(response);
    }

    const userQuery = req.body.query;
    // console.log("Found Shops:", shops);

    // Format shop data
    const shopResponses = shops
      .map(
        (shop) => `
      Shop Details:
      Name: ${shop.name}
      Location: ${shop.location}
      City: ${shop.city}
      State: ${shop.state}
      Support Mobile: ${shop.supportMobile}
      Support Email: ${shop.supportEmail}
      Product Categories: ${shop.productCategories.join(", ")}
      Opening Time: ${shop.openingTime}
      Closing Time: ${shop.closingTime}
      Created: ${shop.createdAt.toLocaleDateString()}
    `
      )
      .join("\n\n");

    // Create prompt for Gemini
    const prompt = `
    You are a helpful assistant for an e-commerce seller platform.
    Here are the seller's shop details:
    ${shopResponses}
    User Question: "${userQuery}"
    Please provide a helpful response based on the available shop information.
    Focus on the specific details from the shops and answer accurately.
    If the information isn't available in the shop data, politely say so.`;

    // Get response from Gemini
    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text();

    // Clean response and send
    const cleanResponse = geminiResponse.replace(
      /[*\/\-\+\%\$#\(\)\{\}\[\]~]/g,
      ""
    );
    const response = await translateText(cleanResponse, lang);
    return res.status(200).send(response);
  } catch (error) {
    const response = await translateText(
      "Sorry, there was an error processing your request.",
      lang
    );
    return res.status(500).send(response);
  }
};

const handleKYC = async (req, res) => {
  const { userId } = req.params;
  const { lang } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const response = await translateText("Invalid user ID format", lang);
      return res.status(400).send(response);
    }

    const kycDocs = await KYC.find({ userId: userId }).exec();

    if (!kycDocs || kycDocs.length === 0) {
      const response = await translateText(
        "No KYC documents found for your account.",
        lang
      );
      return res.status(200).send(response);
    }

    const userQuery = req.body.query;

    // Format KYC data
    const kycResponses = kycDocs
      .map(
        (doc) => `
      KYC Details:
      Document Type: ${doc.documentType}
      Verification Status: ${doc.isVerified ? "Verified" : "Pending"}
      Submitted Date: ${doc.createdAt.toLocaleDateString()}
      Last Updated: ${doc.updatedAt.toLocaleDateString()}
    `
      )
      .join("\n\n");

    const prompt = `
    You are a helpful assistant for an e-commerce seller platform.
    Here are the seller's KYC details:
    ${kycResponses}
    
    User Question: "${userQuery}"
    
    Provide a helpful response about their KYC status and documents.
    Keep the response professional and focus on verification status.
    Don't share any sensitive document details.`;

    const result = await model.generateContent(prompt);
    const cleanResponse = result.response
      .text()
      .replace(/[*\/\-\+\%\$#\(\)\{\}\[\]~]/g, "");

    const response = await translateText(cleanResponse, lang);
    return res.status(200).send(response);
  } catch (error) {
    const response = await translateText(
      "Sorry, there was an error processing your KYC request.",
      lang
    );
    return res.status(500).send(response);
  }
};

const handleUser = async (req, res) => {
  const { userId } = req.params;
  const { lang } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const response = await translateText("Invalid user ID format", lang);
      return res.status(400).send(response);
    }

    const user = await User.findById(userId).select("-password").exec();

    if (!user) {
      const response = await translateText("User not found.", lang);
      return res.status(404).send(response);
    }

    const userQuery = req.body.query;

    // Format user data based on User schema
    const userDetails = `
      User Profile:
      Name: ${user.name}
      Email: ${user.email}
      Mobile: ${user.mob_no}
      Profile Photo: ${user.photo_url ? "Available" : "Not uploaded"}
      Document Verification: ${user.isDocumentVerified ? "Verified" : "Pending"}
      Shop Setup: ${user.isShopSetuped ? "Completed" : "Pending"}
      Account Created: ${new Date(user.createdAt).toLocaleDateString()}
    `;

    const prompt = `
    You are a helpful assistant for an e-commerce seller platform.
    Here are the user's profile details:
    ${userDetails}
    
    User Question: "${userQuery}"
    
    Please provide a helpful response about their profile information.
    DO NOT share any sensitive information.
    Focus on verification status, shop setup status, and general account information.
    If they ask about specific details that aren't available, politely say so.`;

    const result = await model.generateContent(prompt);
    const cleanResponse = result.response
      .text()
      .replace(/[*\/\-\+\%\$#\(\)\{\}\[\]~]/g, "");

    const response = await translateText(cleanResponse, lang);
    return res.status(200).send(response);
  } catch (error) {
    console.error("Error in handleUser:", error);
    const response = await translateText(
      "Sorry, there was an error processing your request.",
      lang
    );
    return res.status(500).send(response);
  }
};

const handleBank = async (req, res) => {
  const { userId } = req.params;
  const { lang } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const response = await translateText("Invalid user ID format", lang);
      return res.status(400).send(response);
    }

    const bankAccounts = await Bank.find({ userId: userId }).exec();

    if (!bankAccounts || bankAccounts.length === 0) {
      const response = await translateText(
        "No bank accounts found for your profile.",
        lang
      );
      return res.status(200).send(response);
    }

    const userQuery = req.body.query;

    // Format bank data securely
    const bankResponses = bankAccounts
      .map(
        (account) => `
      Bank Account Details:
      Bank Name: ${account.bankName}
      Account Type: ${account.accountType}
      Branch: ${account.branchName}
      Status: ${account.isVerified ? "Verified" : "Pending"}
      Last Updated: ${account.updatedAt.toLocaleDateString()}
    `
      )
      .join("\n\n");

    const prompt = `
    You are a helpful assistant for an e-commerce seller platform.
    Here are the seller's bank account details:
    ${bankResponses}
    
    User Question: "${userQuery}"
    
    Provide a helpful response about their bank accounts.
    DO NOT share any sensitive information like account numbers or IFSC codes.
    Focus on general status and verification information.`;

    const result = await model.generateContent(prompt);
    const cleanResponse = result.response
      .text()
      .replace(/[*\/\-\+\%\$#\(\)\{\}\[\]~]/g, "");
    const response = await translateText(cleanResponse, lang);
    return res.status(200).send(response);
  } catch (error) {
    const response = await translateText(
      "Sorry, there was an error processing your bank request.",
      lang
    );
    return res.status(500).send(response);
  }
};

const handleProduct = async (req, res) => {
  const { userId } = req.params;
  const { lang } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const response = await translateText("Invalid user ID format", lang);
      return res.status(400).send(response);
    }

    // First get user's shops
    const shops = await Shop.find({ userId: userId }).exec();
    if (!shops || shops.length === 0) {
      const response = await translateText(
        "You don't have any shops registered to list products.",
        lang
      );
      return res.status(200).send(response);
    }

    // Get products from all user's shops
    const shopIds = shops.map((shop) => shop._id);
    const products = await Product.find({ shopId: { $in: shopIds } }).exec();

    if (!products || products.length === 0) {
      const response = await translateText(
        "No products found in your shops.",
        lang
      );
      return res.status(200).send(response);
    }

    const userQuery = req.body.query;

    // Format product data
    const productResponses = products
      .map(
        (product) => `
      Product Details:
      Name: ${product.name}
      Category: ${product.category}
      Price: ${product.price}
      Stock: ${product.stockQuantity}
      Status: ${product.isActive ? "Active" : "Inactive"}
      Shop: ${
        shops.find((s) => s._id.toString() === product.shopId.toString())
          ?.name || "Unknown Shop"
      }
    `
      )
      .join("\n\n");

    const prompt = `
    You are a helpful assistant for an e-commerce seller platform.
    Here are the seller's product details:
    ${productResponses}
    
    User Question: "${userQuery}"
    
    Provide a helpful response about their products.
    Include specific product details when asked.
    Focus on inventory, pricing, and status information.`;

    const result = await model.generateContent(prompt);
    const cleanResponse = result.response
      .text()
      .replace(/[*\/\-\+\%\$#\(\)\{\}\[\]~]/g, "");

    const response = await translateText(cleanResponse, lang);
    return res.status(200).send(response);
  } catch (error) {
    const response = await translateText(
      "Sorry, there was an error processing your product request.",
      lang
    );
    return res.status(500).send(response);
  }
};

const resetPassword = async (req, res) => {
  const { userId } = req.params;
  const { lang } = req.params;

  try {
    const userQuery = req.body.query;

    const prompt = `You are chatbot on a e-commerce seller application, here to help the user to reset his user account password. Extract the new password from this text: "${userQuery}". Respond with a JSON object containing "newPassword".
    if user query does not contains new password ask from it`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log("Gemini Response:", responseText);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[0].trim());
        const { newPassword } = data;

        if (userId && newPassword) {
          const user = await User.findById(userId);
          if (!user) {
            const response = await translateText(
              "No user found with this ID.",
              lang
            );
            return res.status(404).send(response);
          }

          const hashedPassword = await bcrypt.hash(newPassword.toString(), 10);
          user.password = hashedPassword;
          await user.save();
          const response = await translateText(
            "Password has been successfully updated!",
            lang
          );
          return res.status(200).send(response);
        }
      } catch (parseError) {
        const response = await translateText(
          "Error processing password update.",
          lang
        );
        return res.status(400).send(response);
      }
    } else {
      const response = await translateText(responseText, lang);
      return res.status(200).send(response);
    }
  } catch (error) {
    const response = await translateText("Error reseting your password", lang);
    return res.status(500).send(response);
  }
};

module.exports = {
  handleShopQuery,
  handleKYC,
  handleBank,
  handleProduct,
  resetPassword,
  defaultWelcomeMessage,
  handleUser, // Add handleUser to exports
  handleFunctionalities,
};
