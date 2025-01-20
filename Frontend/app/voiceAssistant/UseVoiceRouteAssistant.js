import { useEffect, useRef } from "react";
import { useSegments } from "expo-router";
import { useVoice } from "./VoiceContext";
import { useMute } from "./MuteContext";
import i18n from "i18next";
import UseRouteAssistant from "./UseRouteAssistant";

const UseVoiceRouteAssistant = () => {
  const currentLanguage = i18n.language;
  const segments = useSegments();
  const { speakText, stopAudio } = useVoice();
  const { isMuted } = useMute();
  const routeText = UseRouteAssistant();
  const lastRouteRef = useRef("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopAudio();
    };
  }, []);

  useEffect(() => {
    const currentRoute = segments[segments.length - 1];
    if (!currentRoute || isMuted) return;

    const textToSpeak = routeText[currentRoute];
    console.log("Current Route:", currentRoute);
    if (!textToSpeak || currentRoute === lastRouteRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    stopAudio();

    timeoutRef.current = setTimeout(() => {
      lastRouteRef.current = currentRoute;
      speakText(textToSpeak, `${currentLanguage}-IN`);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopAudio();
    };
  }, [segments, isMuted, currentLanguage]);

  return null;
};

export default UseVoiceRouteAssistant;
