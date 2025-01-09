import "~/global.css";
import "../utils/language/i18n";
import React from "react";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { MuteProvider } from "./voiceAssistant/MuteContext";
import { VoiceProvider } from "./voiceAssistant/VoiceContext";
import Header from "./myComponent/header";
import useVoiceRouteAssistant from "./voiceAssistant/UseVoiceRouteAssistant";

const RootLayout = () => {
  useVoiceRouteAssistant(); // Use the custom hook

  return (
    <>
      <MuteProvider>
        <VoiceProvider>
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
          </Stack>
          <PortalHost />
        </VoiceProvider>
      </MuteProvider>
    </>
  );
};

export default RootLayout;
