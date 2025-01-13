import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Importing FontAwesome icon

const helpModal = ({ visible, onClose }) => {
  if (!visible) return null; // Conditionally render the component

  return (
    <View className="absolute inset-0 justify-end items-center bg-black opacity-90">
      <View className="w-full p-4 bg-white rounded-t-lg shadow-lg bg-gray-200 border opacity-100">
        <View className="flex flex-row justify-between items-center px-2">
          <Text className="text-2xl font-bold">Help</Text>
          <TouchableOpacity className=" py-2" onPress={onClose}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Text className="text-lg my-4">
          • For creating a PAN card, you can visit the official website:
          <Text
            style={{ color: "blue" }}
            onPress={() => Linking.openURL("https://www.pan.utiitsl.com/PAN/")}
          >
            PAN Card Application Portal
          </Text>
          .
        </Text>

        <Text className="text-lg my-4">
          • For creating a GSTIN certificate, you can visit the official
          website:
          <Text
            style={{ color: "blue" }}
            onPress={() => Linking.openURL("https://www.gst.gov.in/")}
          >
            GST Portal
          </Text>
          .
        </Text>

        <Text className="text-lg my-4">
          • For creating a bank cheque, you can visit your respective bank's
          official website or branch.
        </Text>
      </View>
    </View>
  );
};

export default helpModal;
