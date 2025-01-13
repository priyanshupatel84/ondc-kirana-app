// MuteContext.js
import React, { createContext, useContext, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from Expo Vector Icons

const MuteContext = createContext();

export const MuteProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <MuteContext.Provider value={{ isMuted, toggleMute }}>
      {children}
      <MuteToggle />
    </MuteContext.Provider>
  );
};

export const useMute = () => {
  return useContext(MuteContext);
};

const MuteToggle = () => {
  const { isMuted, toggleMute } = useMute();

  return (
    <View className="absolute m-1 right-0 z-50 p-1">
      <TouchableOpacity
        className="rounded-full p-2 border-black bg-blue-500"
        style={
          isMuted
            ? { backgroundColor: "white" }
            : { backgroundColor: "#0096FF" }
        }
        onPress={toggleMute}
      >
        <Ionicons
          name={isMuted ? "volume-mute" : "volume-high"}
          size={22}
          color={isMuted ? "black" : "white"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MuteToggle;
