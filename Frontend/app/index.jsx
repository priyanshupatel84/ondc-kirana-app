// import { Redirect } from "expo-router";
// import { View } from "react-native";

// const Index = () => {
//   return (
//     <View>
//       <Redirect href="/catalog" />
//     </View>
//   );
// };

// export default Index;

import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import i18n from "../utils/language/i18n"; // Adjust the path as necessary

const Index = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const languages = [
    { label: "English", value: "en" }, // Use language codes
    { label: "অসমীয়া", value: "as" }, // Assamese in Assamese
    { label: "বাংলা", value: "bn" }, // Bengali in Bengali
    { label: "ગુજરાતી", value: "gu" }, // Gujarati in Gujarati
    { label: "हिन्दी", value: "hi" }, // Hindi in Hindi script
    { label: "ಕನ್ನಡ", value: "kn" }, // Kannada in Kannada
    { label: "മലയാളം", value: "ml" }, // Malayalam in Malayalam script
    { label: "मराठी", value: "mr" }, // Marathi in Marathi script
    { label: "ଓଡ଼ିଆ", value: "or" }, // Oriya in Oriya script
    { label: "ਪੰਜਾਬੀ", value: "pa" }, // Punjabi in Punjabi script
    { label: "தமிழ்", value: "ta" }, // Tamil in Tamil script
    { label: "తెలుగు", value: "te" }, // Telugu in Telugu script
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Change the language in i18n
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.value);
    changeLanguage(language.value); // Change the language when selected
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
          onPress={() => router.push("/(tabs)/home")}
          className="mt-4 w-[250px] bg-blue-500 active:bg-blue-400"
        >
          <Text className="text-white font-semibold text-xl ">Next</Text>
        </Button>
      )}
    </View>
  );
};

export default Index;
