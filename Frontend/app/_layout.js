import "~/global.css";
import "../utils/language/i18n";
import React from "react";
import { MuteProvider } from "./voiceAssistant/MuteContext";
import { VoiceProvider } from "./voiceAssistant/VoiceContext";
import Header from "./myComponent/header";
import UseVoiceRouteAssistant from "./voiceAssistant/UseVoiceRouteAssistant";
import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout() {
  UseVoiceRouteAssistant();

  return (
    <AuthProvider>
      <MuteProvider>
        <VoiceProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />

            <Stack.Screen
              name="(docVerification)"
              options={{
                headerShown: true,
                header: () => <Header />,
              }}
            />
            <Stack.Screen
              name="(shopDetails)"
              options={{
                headerShown: true,
                header: () => <Header />,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: true,
                header: () => <Header />,
              }}
            />
          </Stack>
        </VoiceProvider>
      </MuteProvider>
    </AuthProvider>
  );
}
