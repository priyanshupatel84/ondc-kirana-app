// voiceAssistant/useVoiceRouteAssistant.js
import { useEffect, useState } from "react";
import { useSegments } from "expo-router";
import { useVoice } from "./VoiceContext";
import i18n from "i18next";
import UseRouteAssistant from "./UseRouteAssistant";

const UseVoiceRouteAssistant = () => {
  const currentLanguage = i18n.language; // Get the current language
  const segments = useSegments(); // Get the current route segments
  const { speakText, stopAudio } = useVoice(); // Get the speakText and stopAudio functions
  const [lastSpokenRoute, setLastSpokenRoute] = useState(""); // State to track the last spoken route
  const routeText = UseRouteAssistant(); // Get the translated route texts

  useEffect(() => {
    // Get the current route key
    const currentRoute = segments[segments.length - 1]; // Get the last segment
    console.log("Current Route:", currentRoute);

    const textToSpeak =
      routeText[currentRoute] || routeText["anotherComponent"]; // Get the text based on the current route

    // Speak the text if it exists and if the route has changed
    if (textToSpeak && currentRoute !== lastSpokenRoute) {
      stopAudio(); // Stop any currently playing audio
      speakText(textToSpeak, `${currentLanguage}-IN`); // Specify the language code
      setLastSpokenRoute(currentRoute); // Update the last spoken route
    }
  }, [
    segments,
    speakText,
    lastSpokenRoute,
    stopAudio,
    routeText,
    currentLanguage,
  ]); // Dependency array to trigger on segments change
};

export default UseVoiceRouteAssistant;
