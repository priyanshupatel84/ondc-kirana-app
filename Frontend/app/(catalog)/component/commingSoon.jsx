import { View, Text, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

const ComingSoon = () => {
  const scaleValue = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.95,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      {/* Container with subtle shadow and rounded corners */}
      <View className="items-center rounded-2xl bg-white p-8 shadow-lg">
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <View className="items-center space-y-4">
            {/* Icon container with gradient-like background */}
            <View className="rounded-full bg-blue-50 p-4">
              <Ionicons name="time-outline" size={48} color="#3B82F6" />
            </View>

            {/* Text content */}
            <Text className="text-2xl font-semibold text-gray-800">
              Coming Soon
            </Text>
            <Text className="text-center text-sm text-gray-500">
              This feature is not available yet
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default ComingSoon;
