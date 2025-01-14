import React from "react";
import { Stack } from "expo-router";

const DocVerificationLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="verifiedData/bankDetails" />
      <Stack.Screen name="verifiedData/kycDetails" />
    </Stack>
  );
};

export default DocVerificationLayout;
