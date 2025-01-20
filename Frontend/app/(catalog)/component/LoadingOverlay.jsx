import React from "react";
import { View, Text } from "react-native";

const LoadingOverlay = ({ loadingStatus, loadingProgress, t }) => {
  return (
    <View className="absolute z-10 w-full h-full bg-black/60 items-center justify-center">
      <View className="bg-white p-6 rounded-xl shadow-lg w-[80%] max-w-sm">
        <Text className="text-xl font-semibold text-center mb-3">
          {t(loadingStatus)}
        </Text>
        <View className="w-full bg-gray-200 rounded-full h-2 mb-1">
          <View
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          />
        </View>
        <Text className="text-center text-gray-600">{t(loadingProgress)}%</Text>
      </View>
    </View>
  );
};

export default LoadingOverlay;
