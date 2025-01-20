import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SubmitButton = ({ isSubmitting, onSubmit, messages }) => {
  return (
    <TouchableOpacity
      onPress={onSubmit}
      disabled={isSubmitting}
      className="rounded-xl py-4 px-6 my-4 flex-row justify-center items-center bg-blue-600"
      style={{
        opacity: isSubmitting ? 0.7 : 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      activeOpacity={0.8}
    >
      {isSubmitting ? (
        <View className="flex-row items-center space-x-2">
          <ActivityIndicator color="white" size="small" />
          <Text className="text-white font-semibold text-lg ml-2">
            {messages.saving}
          </Text>
        </View>
      ) : (
        <View className="flex-row items-center">
          <Text className="text-white font-semibold text-lg mr-2">
            {messages.saveConfiguration}
          </Text>
          <MaterialIcons name="check-circle" size={24} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SubmitButton;
