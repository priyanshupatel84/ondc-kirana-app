import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import i18next from "i18next";
import i18n from "../../utils/language/i18n";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const LanguageSelector = () => {
  const languageOptions = [
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

  const [selectedValue, setSelectedValue] = useState("Translate");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSelect = (item) => {
    i18n.changeLanguage(item.value);
    console.log(i18next.language);
    setSelectedValue(item.label);
    setDropdownVisible(false);
  };

  return (
    <View className="flex items-center h-[48px] right-12 pt-3">
      <Pressable
        className="bg-gray-100 py-1 px-2 rounded-lg w-26 mx-2 my-auto mb-1 items-center border-black  flex-row justify-center border-[1px] border-gray-400"
        onPress={() => setDropdownVisible((prev) => !prev)}
      >
        <FontAwesome
          name="language"
          size={20}
          color="black"
          style={{ marginRight: 5 }}
        />
        <Text className="text-lg font-semibold">{selectedValue}</Text>
      </Pressable>

      {dropdownVisible && (
        <View className="z-1000 bg-white w-28 rounded-lg border border-gray-300 shadow-md">
          {languageOptions.map((item) => (
            <TouchableOpacity
              key={item.value}
              className="p-2 flex border-b border-gray-200"
              onPress={() => handleSelect(item)}
            >
              <Text className="text-lg text-gray-800 text-center">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default LanguageSelector;
