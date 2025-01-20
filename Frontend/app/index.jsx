import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import i18n from "../utils/language/i18n";
import { useAuth } from "./context/AuthContext";
import { Redirect } from "expo-router";
import { useVoice } from "./voiceAssistant/VoiceContext";

const LanguageSelection = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { speakText, stopAudio } = useVoice();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const hasSpokenRef = useRef(false);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  useEffect(() => {
    if (!hasSpokenRef.current && !loading) {
      speakText(
        "Welcome to ONDC! Please select your preferred language from the options below.After selecting your language, click the 'Next' button to continue.",
        "en-IN"
      );
      hasSpokenRef.current = true;
    }
  }, [loading]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-800">Loading...</Text>
      </View>
    );
  }

  if (user) {
    if (!user.isDocumentVerified) {
      return <Redirect href="/(docVerification)/docVerificationIndex" />;
    } else if (!user.isShopSetuped) {
      return <Redirect href="/(shopDetails)/shopDetailsIndex" />;
    }
    return <Redirect href="/(tabs)/home" />;
  }

  const languages = [
    { label: "English", value: "en" },
    { label: "বাংলা", value: "bn" },
    { label: "ગુજરાતી", value: "gu" },
    { label: "हिन्दी", value: "hi" },
    { label: "ಕನ್ನಡ", value: "kn" },
    { label: "മലയാളം", value: "ml" },
    { label: "मराठी", value: "mr" },
    { label: "ਪੰਜਾਬੀ", value: "pa" },
    { label: "தமிழ்", value: "ta" },
    { label: "తెలుగు", value: "te" },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.value);
    changeLanguage(language.value);
  };

  const handleNext = () => {
    stopAudio();
    router.push("./(auth)/login");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-2">
      <View>
        <Image
          source={require("../assets/images/ONDC-banner.png")}
          style={{ width: 300, height: 250 }}
        />
      </View>
      <View className="m-2 flex-row items-center justify-center">
        <Image
          source={require("../assets/images/language-icon.png")}
          style={{ width: 55, height: 55 }}
        />
        <Text className="text-2xl font-bold m-4">Select your language</Text>
      </View>

      <View className="h-[300px]">
        <ScrollView className="w-[250px] px-2" persistentScrollbar={true}>
          {languages.map((language) => (
            <Button
              variant="outline"
              key={language.value}
              onPress={() => handleLanguageSelect(language)}
              className={`p-2 my-1 border bg-white ${
                selectedLanguage === language.value
                  ? "border-blue-500 bg-gray-100"
                  : "border-gray-300"
              }`}
            >
              <Text>{language.label}</Text>
            </Button>
          ))}
        </ScrollView>
      </View>

      {selectedLanguage && (
        <Button
          size="lg"
          variant="destructive"
          onPress={handleNext}
          className="mt-4 w-[250px] bg-blue-500 active:bg-blue-400"
        >
          <Text className="text-white font-semibold text-xl">Next</Text>
        </Button>
      )}
    </View>
  );
};

export default LanguageSelection;
