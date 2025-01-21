import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const Header = ({ title = "Tutorial" }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View
      className="flex-row items-center bg-blue-500 px-4"
      style={{ height: 54 }}
    >
      <TouchableOpacity onPress={() => router.back()} className="mr-2">
        <Icon name="keyboard-backspace" size={24} color="white" />
      </TouchableOpacity>

      <View className="flex-1 flex-row items-center justify-center">
        <Icon
          name="play-circle-filled"
          size={24}
          color="white"
          className="mr-2"
        />
        <Text className="font-bold text-2xl text-white">{t(title)}</Text>
      </View>

      <View className="w-10" />
    </View>
  );
};

const Tutorial = () => {
  return (
    <View className="flex-1 bg-white">
      <Header />

      <ScrollView className="flex-1 p-4">
        <View
          style={{ height: 250, marginBottom: 20 }}
          className="rounded-xl overflow-hidden border-2 border-blue-500"
        >
          <WebView
            className="w-full h-full"
            source={{
              uri: "https://www.youtube.com/embed/wI8w32QxOv4?si=tNMYpSj2-SgokiYX",
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        </View>

        <View
          style={{ height: 250, marginBottom: 20 }}
          className="rounded-xl overflow-hidden border-2 border-blue-500"
        >
          <WebView
            className="w-full h-full"
            source={{
              uri: "https://www.youtube.com/embed/56lGuw8m_yU?si=xBiZYAinBfAYwSzT",
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        </View>

        {/* Third WebView */}
        <View
          style={{ height: 250, marginBottom: 20 }}
          className="rounded-xl overflow-hidden border-2 border-blue-500"
        >
          <WebView
            className="w-full h-full"
            source={{
              uri: "https://www.youtube.com/embed/IKActwNMsmU?si=-ZNwHWuSVwvCgip2",
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Tutorial;
