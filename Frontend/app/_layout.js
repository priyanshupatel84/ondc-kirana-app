// app/_layout.tsx
import "~/global.css";
import "../utils/language/i18n";
import React from "react";
import { Stack } from "expo-router";
import { View, Image } from "react-native";
import LanguageSelector from "./myComponent/languageSelector";
import { PortalHost } from "@rn-primitives/portal";

const Header = () => (
  <View
    className={`h-[48px] px-1 flex-row justify-between border-b border-gray-300 bg-white`}
  >
    <View>
      <Image
        source={require("../assets/images/ONDC-pure-logo.png")}
        style={{ width: 180, height: 40 }}
      />
    </View>
    <LanguageSelector />
  </View>
);

const RootLayout = () => {
  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            header: () => <Header />,
          }}
        />
        <Stack.Screen name="(auth)" />
        <PortalHost />
      </Stack>
    </View>
  );
};

export default RootLayout;
