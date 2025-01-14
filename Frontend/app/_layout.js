import "~/global.css";
import "../utils/language/i18n";
import React, { useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { MuteProvider } from "./voiceAssistant/MuteContext";
import { VoiceProvider } from "./voiceAssistant/VoiceContext";
import Header from "./myComponent/header";
import UseVoiceRouteAssistant from "./voiceAssistant/UseVoiceRouteAssistant";
import { AuthContext } from "./context/AuthContext";

const RootLayout = () => {
  const { user, loading } = useContext(AuthContext);
  //console.log("RootLayout -> user", user);
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0096FF" />
        <Text className="text-xl font-semibold mt-4">Verifying</Text>
      </View>
    );
  }

  UseVoiceRouteAssistant();

  return (
    <MuteProvider>
      <VoiceProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {!user ? (
            <Stack.Screen name="index" />
          ) : (
            <Stack.Screen
              name="(docVerification)"
              options={{
                headerShown: true,
                header: () => <Header />,
              }}
            />
          )}
          <Stack.Screen
            name="(tabs)"
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
        </Stack>
        {/* <Stack
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

          <Stack.Screen name="(docVerification)" /> 
        </Stack>*/}
        <PortalHost />
      </VoiceProvider>
    </MuteProvider>
  );
};

export default RootLayout;
