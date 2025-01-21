import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { MessageCircle, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { MaterialIcons } from "@expo/vector-icons";

// LoadingDots component for animation
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
    <View
      style={{
        flexDirection: "row",
        padding: 8,
        backgroundColor: "#f0f0f0",
        borderRadius: 16,
      }}
    >
      {[dot1, dot2, dot3].map((dot, index) => (
        <Animated.View
          key={index}
          style={[dotStyle, { transform: [{ translateY: dot }] }]}
        />
      ))}
    </View>
  );
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadMessages();
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
    Animated.spring(slideAnim, {
      toValue: isOpen ? 0 : 1,
      useNativeDriver: true,
      tension: 20,
      friction: 7,
    }).start();
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
      const userId = await AsyncStorage.getItem("userId");
      const lang = i18n.language;

      if (!userId) {
        throw new Error("UserId not found in storage");
      }

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_MY_API_URL}/api/chatbot/${userId}/${lang}`,
        { query: inputText },
        {
          validateStatus: function (status) {
            return status >= 200 && status < 400;
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

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
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <>
      {!isOpen && (
        <TouchableOpacity
          onPress={toggleChat}
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: "#007BFF",
            borderRadius: 24,
            padding: 12,
            elevation: 5,
          }}
        >
          <MaterialIcons name="chat" size={24} color="white" />
        </TouchableOpacity>
      )}

      {isOpen && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 20,
            right: 16,
            width: "90%",
            maxWidth: 350,
            height: 500,
            backgroundColor: "white",
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [700, 0],
                }),
              },
            ],
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
              <View
                style={{
                  backgroundColor: "#007BFF",
                  padding: 16,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "600" }}
                >
                  Chat Support
                </Text>
                <TouchableOpacity
                  onPress={toggleChat}
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    backgroundColor: "#0056b3",
                    borderRadius: 24,
                    padding: 8,
                  }}
                >
                  <MaterialIcons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <ScrollView
                ref={scrollViewRef}
                style={{ flex: 1, paddingHorizontal: 16, marginTop: 8 }}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {messages.map((message, index) => (
                  <View
                    key={index}
                    style={{
                      marginBottom: 10,
                      alignItems: message.isUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <View
                      style={{
                        padding: 10,
                        borderRadius: 16,
                        backgroundColor: message.isUser ? "#007BFF" : "#e0e0e0",
                        maxWidth: "80%",
                      }}
                    >
                      <Text
                        style={{
                          color: message.isUser ? "white" : "black",
                          fontSize: 16,
                        }}
                      >
                        {message.text}
                      </Text>
                    </View>
                  </View>
                ))}
                {isLoading && (
                  <View style={{ marginBottom: 10, alignItems: "flex-start" }}>
                    <LoadingDots />
                  </View>
                )}
              </ScrollView>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderTopWidth: 1,
                  borderTopColor: "#e0e0e0",
                  backgroundColor: "white",
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 24,
                    paddingHorizontal: 16,
                    paddingVertical: 5,
                    fontSize: 16,
                    height: 40,
                  }}
                  placeholder="Type your message..."
                  value={inputText}
                  onChangeText={setInputText}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  multiline
                  maxHeight={80}
                />
                <TouchableOpacity
                  onPress={sendMessage}
                  style={{
                    backgroundColor: "#007BFF",
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 8,
                  }}
                  disabled={!inputText.trim()}
                >
                  <MaterialIcons name="send" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </>
  );
};

export default ChatBot;
