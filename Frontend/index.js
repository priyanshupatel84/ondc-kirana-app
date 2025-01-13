import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { MuteProvider } from "./app/voiceAssistant/MuteContext"; // Adjust the import path as necessary
import { VoiceProvider } from "./app/voiceAssistant/VoiceContext"; // Adjust the import path as necessary
import { AuthProvider } from "./app/context/AuthContext";

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app");

  return (
    <AuthProvider>
      <MuteProvider>
        <VoiceProvider>
          <ExpoRoot context={ctx} />
        </VoiceProvider>
      </MuteProvider>
    </AuthProvider>
  );
}

registerRootComponent(App);
