// components/ProductSkeleton.js
import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";

const ProductSkeleton = () => {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.5, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="rounded-xl shadow-sm px-2 py-1 mx-2 my-1 bg-white border border-gray-300">
      {/* Top Section */}
      <View className="flex-row p-2 border-b border-gray-300">
        {/* Image skeleton */}
        <Animated.View
          style={animatedStyle}
          className="h-[100px] w-[100px] bg-gray-200 rounded-lg mr-4"
        />

        {/* Content skeleton */}
        <View className="flex-1 justify-between">
          <View className="space-y-2">
            {/* Title */}
            <Animated.View
              style={animatedStyle}
              className="h-5 bg-gray-200 rounded w-3/4"
            />
            {/* Category */}
            <Animated.View
              style={animatedStyle}
              className="h-4 bg-gray-200 rounded w-1/2"
            />
            {/* Price */}
            <Animated.View
              style={animatedStyle}
              className="h-6 bg-gray-200 rounded w-1/3"
            />
            {/* Description */}
            <Animated.View
              style={animatedStyle}
              className="h-4 bg-gray-200 rounded w-full"
            />
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View className="flex-row justify-between items-center p-1 pt-2">
        {/* Stock badge skeleton */}
        <Animated.View
          style={animatedStyle}
          className="h-6 bg-gray-200 rounded-full w-24"
        />

        {/* Action buttons skeleton */}
        <View className="flex-row gap-2">
          <Animated.View
            style={animatedStyle}
            className="h-8 bg-gray-200 rounded-lg w-16"
          />
          <Animated.View
            style={animatedStyle}
            className="h-8 bg-gray-200 rounded-lg w-20"
          />
        </View>
      </View>
    </View>
  );
};

export const SkeletonLoader = () => {
  return (
    <View className="flex-1">
      {[1, 2, 3, 4].map((key) => (
        <ProductSkeleton key={key} />
      ))}
    </View>
  );
};

export default ProductSkeleton;
