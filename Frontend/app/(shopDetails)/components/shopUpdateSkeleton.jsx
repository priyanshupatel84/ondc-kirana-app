import React from "react";
import { View } from "react-native";

const ShopUpdateSkeleton = () => {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="h-8 w-3/4 bg-gray-200 rounded-md animate-pulse" />
        <View className="h-4 w-1/2 bg-gray-200 rounded-md mt-2 animate-pulse" />
      </View>

      <View className="p-4">
        <View className="mb-6">
          <View className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        </View>

        <View className="mb-6">
          <View className="h-5 w-32 bg-gray-200 rounded-md mb-2 animate-pulse" />
          <View className="flex-row justify-between mb-4">
            <View className="h-12 w-[48%] bg-gray-200 rounded-lg animate-pulse" />
            <View className="h-12 w-[48%] bg-gray-200 rounded-lg animate-pulse" />
          </View>
        </View>

        <View className="mb-6">
          <View className="h-5 w-40 bg-gray-200 rounded-md mb-2 animate-pulse" />
          <View className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        </View>

        <View className="mb-6">
          <View className="h-5 w-36 bg-gray-200 rounded-md mb-2 animate-pulse" />
          <View className="h-12 bg-gray-200 rounded-lg mb-3 animate-pulse" />
          <View className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        </View>

        <View className="mb-6">
          <View className="h-5 w-32 bg-gray-200 rounded-md mb-2 animate-pulse" />
          <View className="h-12 bg-gray-200 rounded-lg mb-3 animate-pulse" />
          <View className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        </View>
        <View className="mb-6">
          <View className="h-5 w-32 bg-gray-200 rounded-md mb-2 animate-pulse" />
          <View className="h-12 bg-gray-200 rounded-lg mb-3 animate-pulse" />
          <View className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        </View>

        <View className="h-12 bg-gray-200 rounded-lg mt-4 animate-pulse" />
      </View>
    </View>
  );
};

export default ShopUpdateSkeleton;
