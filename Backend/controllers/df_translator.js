const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate();

const translateText = async (text, targetLanguage) => {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (err) {
    console.error("Error during translation:", err);
    throw err;
  }
};

module.exports = { translateText };
