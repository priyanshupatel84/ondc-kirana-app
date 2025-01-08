import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icon library

const ReturnLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: ({ navigation }) => (
            <View className="flex-row items-center h-16 bg-blue-500 px-4">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="mr-2" // Space between back button and title
              >
                <Icon name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View className="flex-1 flex-row items-center justify-center">
                <Icon
                  name="assignment-return"
                  size={24}
                  color="white"
                  className="mr-2" // Space between icon and title
                />
                <Text className="font-bold text-xl text-white">Returns</Text>
              </View>
              <View className="w-10" />
            </View>
          ),
          headerStyle: {
            height: 60, // Adjusted height for better visibility
          },
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
};

export default ReturnLayout;
