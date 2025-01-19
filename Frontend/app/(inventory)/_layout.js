import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

// Common header component to reduce duplication
const Header = ({ iconName }) => {
  const router = useRouter();
  return (
    <View
      className="flex-row items-center bg-blue-500 px-4"
      style={{ height: 54 }}
    >
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/home")}
        className="mr-2"
      >
        <Icon name="keyboard-backspace" size={24} color="white" />
      </TouchableOpacity>
      <View className="flex-1 flex-row items-center justify-center">
        <Icon name={iconName} size={24} color="white" className="mr-2" />
        <Text className="font-bold text-2xl text-white">Inventory</Text>
      </View>
      <View className="w-10" />
    </View>
  );
};

const InventoryLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header iconName="inventory" />,
          headerStyle: {
            height: 60,
          },
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
};

export default InventoryLayout;
