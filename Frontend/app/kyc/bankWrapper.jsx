import { View, Text, Image } from "react-native";
import React from "react";
import BankDetails from "./bankDetails";

const Wrapper = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View>
        <Image
          source={require("../../assets/images/ONDC-only-logo.png")}
          style={{ width: 300, height: 100 }}
        />
      </View>
      <BankDetails />
    </View>
  );
};

export default Wrapper;
