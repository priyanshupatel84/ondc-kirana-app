import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

const InventoryLayout = () => {
  const router = useRouter();

  const handleBack = () => {
    router.replace("/(tabs)");
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <View className="flex-row items-center h-16 bg-blue-500 px-4">
              <TouchableOpacity onPress={handleBack} className="mr-2">
                <Icon name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View className="flex-1 flex-row items-center justify-center">
                <Icon
                  name="inventory"
                  size={24}
                  color="white"
                  className="mr-2"
                />
                <Text className="font-bold text-2xl text-white">Inventory</Text>
              </View>
              <View className="w-10" />
            </View>
          ),
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
