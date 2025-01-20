import React from "react";
import { Stack } from "expo-router";

const ShopLayout = () => {
  return (
    <Stack options={{ headerShown: false }}>
      <Stack.Screen
        name="shopDetailsIndex"
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
      <Stack.Screen
        name="updateShop"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default ShopLayout;
