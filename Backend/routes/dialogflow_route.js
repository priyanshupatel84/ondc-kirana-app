const express = require("express");
const CONTROLLER = require("../controllers/export_controller");
const { translateText } = require("../controllers/df_translator");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/:userId/:lang", async (req, res) => {
  const lang = req.params.lang;
  const userQuery = req.body.query;

  try {
    const prompt = `"Analyze the user query : "${userQuery}" to determine its intent based on the following tags:
defaultWelcome: For welcoming the user when they ask general or basic questions like greetings, inquiries about the bot's purpose, or introductory queries.
getBankDetails: For questions related to banking details, such as account balance, transaction history, or bank services.
getShopsDetails: For queries about shop-related details, including shop locations, working hours, or contact information.
getKYCDetails: For questions concerning KYC (Know Your Customer) processes, such as document submission or verification status.
getOrderDetails: For inquiries about order status, tracking, or purchase details.
getProductDetails: For questions about product specifications, availability, or pricing.
resetPassword: For queries where the user explicitly mentions resetting or recovering their password.
Respond only with the most relevant tag from the above list. If the query does not clearly match any tag, default to "defaultWelcome".
    `;

    const result = await model.generateContent(prompt);
    const tag = result.response.text().trim();
    console.log("Determined tag:", tag);

    let response;
    
    switch (tag) {
      case "defaultWelcome":
        await CONTROLLER.dbController.defaultWelcomeMessage(req, res);
        break;
      case "getBankDetails":
        await CONTROLLER.dbController.handleBank(req, res);
        break;
      case "getShopsDetails":
        await CONTROLLER.dbController.handleShopQuery(req, res);
        break;
      case "getKYCDetails":
        await CONTROLLER.dbController.handleKYC(req, res);
        break;
      case "getOrderDetails":
        await CONTROLLER.dbController.handleOrder(req, res);
        break;
      case "getProductDetails":
        await CONTROLLER.dbController.handleProduct(req, res);
        break;
      case "resetPassword":
        await CONTROLLER.dbController.resetPassword(req, res);
        break;
      default:
        const defaultResponses = [
          "I'm sorry, I couldn't understand your request.",
          "I'm sorry, I can only answer questions about the shops and their details.",
          "It seems I didn't understand you correctly. Could you try asking in a different way?",
          "My capabilities are focused on shop-related inquiries. Let me know if there's anything specific you'd like to know.",
        ];
        const randomIndex = Math.floor(Math.random() * defaultResponses.length);
        response = await translateText(defaultResponses[randomIndex], lang);
        return res.status(200).json({ message: response });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    try {
      const errorMessage = "Sorry, there was an error processing your request.";
      const translatedError = await translateText(errorMessage, lang);
      return res.status(500).json({ error: translatedError });
    } catch (translationError) {
      console.error("Translation error:", translationError);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

module.exports = router;
