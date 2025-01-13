import React from "react";
import { Stack } from "expo-router";
import Header from "../myComponent/header";

const ShopLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header />,
        }}
      />
    </Stack>
  );
};

export default ShopLayout;
