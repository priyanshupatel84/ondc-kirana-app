import React from "react";
import { View, StyleSheet } from "react-native";
import ChatBotComp from "../myComponent/chatBotComp";

const ChatBotScreen = () => {
  return (
    <View style={styles.container}>
      <ChatBotComp />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
});

export default ChatBotScreen;
