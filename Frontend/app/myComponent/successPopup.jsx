import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SuccessPopup = ({
  visible,
  message = "Operation completed successfully!",
  title = "Success!",
  duration = 2000,
  onClose,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);

      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Setup timeout for hiding
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onClose) {
            onClose();
          }
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeAnim,
        zIndex: 1000,
      }}
    >
      <Animated.View
        className="bg-white rounded-2xl p-6 m-4 items-center shadow-lg"
        style={{
          transform: [{ scale: scaleAnim }],
          minWidth: 300,
        }}
      >
        <Animated.View
          className="bg-green-100 rounded-full p-3 mb-4"
          style={{
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0.8, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          }}
        >
          <MaterialIcons name="check-circle" size={48} color="#10B981" />
        </Animated.View>
        <Text className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </Text>
        <Text className="text-gray-600 text-center">{message}</Text>
      </Animated.View>
    </Animated.View>
  );
};

export default SuccessPopup;
