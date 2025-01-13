import React from "react";
import { Stack } from "expo-router";
import Header from "../myComponent/header";

const DocVerificationLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header />,
        }}
      />
      <Stack.Screen
        name="verifiedData/bankDetails"
        options={{
          header: () => <Header />,
        }}
      />
      <Stack.Screen
        name="verifiedData/kycDetails"
        options={{
          header: () => <Header />,
        }}
      />
    </Stack>
  );
};

export default DocVerificationLayout;
