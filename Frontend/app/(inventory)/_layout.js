import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";

const Header = ({ navigation, iconName }) => {
  const { t } = useTranslation();
  return (
    <View
      className="flex-row items-center bg-blue-500 px-4"
      style={{ height: 54 }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
        <Icon name="keyboard-backspace" size={24} color="white" />
      </TouchableOpacity>
      <View className="flex-1 flex-row items-center justify-center">
        <Icon name={iconName} size={24} color="white" className="mr-2" />
        <Text className="font-bold text-2xl text-white">{t("Inventory")}</Text>
      </View>
      <View className="w-10" />
    </View>
  );
};

const InventoryLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="inventoryIndex"
        options={{
          header: ({ navigation }) => (
            <Header navigation={navigation} iconName="inventory" />
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
