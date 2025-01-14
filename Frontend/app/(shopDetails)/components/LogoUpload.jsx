import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const LogoUpload = ({ logo, onLogoPress, t }) => (
  <TouchableOpacity
    onPress={onLogoPress}
    className="px-2 mb-2 mx-4"
    activeOpacity={0.7}
  >
    <View className="w-3/4 h-56 self-center rounded-3xl justify-center items-center bg-blue-50 border border-blue-400">
      {logo ? (
        <View className="w-full h-full rounded-3xl overflow-hidden p-1">
          <Image
            source={{ uri: logo }}
            className="w-full h-full"
            resizeMode="contain"
          />
          <TouchableOpacity
            className="absolute bottom-2 right-2  p-2 rounded-full bg-blue-500"
            onPress={onLogoPress}
          >
            <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center space-y-4">
          <View className="bg-blue-100 p-4 rounded-full">
            <MaterialIcons
              name="add-photo-alternate"
              size={48}
              color="#1d4ed8"
            />
          </View>
          <View className="space-y-2">
            <Text className="text-center text-xl text-blue-700 font-semibold">
              {t("Upload Logo")}
            </Text>
            <Text className="text-center text-sm text-blue-500">
              {t("Tap to choose an image")}
            </Text>
          </View>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export default LogoUpload;
