// Import the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Path to your service account key JSON file
const keyPath = './key.json';

// Initialize the Translation client
const translate = new Translate({
  keyFilename: keyPath,
});

// Function to translate text
const translateText = async (text, targetLanguage) => {
  try {
    // Translate the text
    const [translation] = await translate.translate(text, targetLanguage);
    // console.log(`Original: ${text}`);
    // console.log(`Translation: ${translation}`);
    return translation;
  } catch (err) {
    console.error('Error during translation:', err);
  }
};

// Example usage
module.exports = { translateText };
