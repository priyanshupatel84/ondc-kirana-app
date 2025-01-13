import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_VISION_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;
const GOOGLE_GEMINI_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;

export const callGoogleVisionAsync = async (base64Image) => {
  const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`; // Replace with your actual API key

  const body = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [
          {
            type: "DOCUMENT_TEXT_DETECTION",
            maxResults: 1,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return result.responses[0]?.fullTextAnnotation?.text || "No text found";
  } catch (error) {
    throw new Error("Error calling Google Vision API");
  }
};

export const analyzeTextWithGemini = async (customPrompt) => {
  const genAI = new GoogleGenerativeAI(`${GOOGLE_GEMINI_API_KEY}`);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const response = await model.generateContent(customPrompt);
    const candidates = response?.response?.candidates;

    if (candidates && candidates.length > 0) {
      const responseText = candidates[0]?.content?.parts[0]?.text || "";
      const jsonString = responseText.replace(/```json\n|\n```/g, "").trim();
      console.log("Gemini response:", jsonString);
      const jsonResponse = JSON.parse(jsonString);
      return jsonResponse;
    }
  } catch (error) {
    throw new Error("Error analyzing text with Gemini API");
  }
};
