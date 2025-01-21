import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  Keyboard,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const LoadingDots = () => {
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));

  useEffect(() => {
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -5,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, []);

  const dotStyle = {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#666",
    marginHorizontal: 2,
  };

  return (
    <View style={styles.loadingContainer}>
      {[dot1, dot2, dot3].map((dot, index) => (
        <Animated.View
          key={index}
          style={[dotStyle, { transform: [{ translateY: dot }] }]}
        />
      ))}
    </View>
  );
};

const ChatBotComp = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    loadMessages();

    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem("chatMessages");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        const defaultMessage = [
          { text: "Hello! How can I help you today?", isUser: false },
        ];
        setMessages(defaultMessage);
        await AsyncStorage.setItem(
          "chatMessages",
          JSON.stringify(defaultMessage)
        );
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const saveMessages = async (newMessages) => {
    try {
      await AsyncStorage.setItem("chatMessages", JSON.stringify(newMessages));
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage = { text: inputText, isUser: true };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await saveMessages(updatedMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const lang = i18n.language;
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_MY_API_URL}/api/chatbot/${user._id}/${lang}`,
        { query: inputText },
        {
          validateStatus: function (status) {
            return status >= 200 && status < 400;
          },
        }
      );

      if (response.status >= 200 && response.status < 400) {
        const botResponse = response.data || "Sorry, I couldn't process that.";
        const botMessage = { text: botResponse, isUser: false };
        const finalMessages = [...updatedMessages, botMessage];
        setMessages(finalMessages);
        await saveMessages(finalMessages);
      } else {
        throw new Error("Invalid response status");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        text:
          error.response?.data?.error ||
          "Sorry, I'm having trouble connecting right now.",
        isUser: false,
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, keyboardHeight]);

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("Chat Support")}</Text>
        </View>

        <View style={styles.content}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={[
              styles.messagesList,
              {
                paddingBottom:
                  Platform.OS === "ios" ? keyboardHeight + 90 : 120,
              },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageWrapper,
                  message.isUser
                    ? styles.userMessageWrapper
                    : styles.botMessageWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.isUser ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.isUser
                        ? styles.userMessageText
                        : styles.botMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              </View>
            ))}
            {isLoading && (
              <View style={styles.loadingWrapper}>
                <LoadingDots />
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              className="flex-1 bg-gray-100 rounded-3xl px-4  py-3 text-base text-right"
              style={{ textAlign: "left" }}
              placeholder="Type your message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxHeight={80}
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              disabled={!inputText.trim()}
            >
              <MaterialIcons name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#007BFF",
    padding: 13,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesList: {
    paddingTop: 16,
  },
  messageWrapper: {
    marginBottom: 10,
  },
  userMessageWrapper: {
    alignItems: "flex-end",
  },
  botMessageWrapper: {
    alignItems: "flex-start",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#007BFF",
  },
  botMessage: {
    backgroundColor: "#e0e0e0",
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: "white",
    textAlign: "right",
  },
  botMessageText: {
    color: "black",
    textAlign: "left",
  },
  loadingWrapper: {
    marginBottom: 10,
    alignItems: "flex-start",
  },
  loadingContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
  },
  inputWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#cccccc",
  },
});

export default ChatBotComp;
