// ~/components/Layout.jsx
import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ padding: 16, backgroundColor: "#f8f8f8" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>My App Header</Text>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* Footer */}
      <View style={{ padding: 16, backgroundColor: "#f8f8f8" }}>
        <Text style={{ textAlign: "center" }}>My App Footer</Text>
      </View>
    </View>
  );
};

export default Layout;
