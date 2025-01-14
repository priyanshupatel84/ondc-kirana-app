import React from "react";
import { Stack } from "expo-router";
import Header from "../myComponent/header";

const ShopLayout = () => {
  return (
    <Stack options={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="configureStore"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default ShopLayout;
