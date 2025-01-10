import React from "react";
import { View, Image } from "react-native";
import LanguageSelector from "./languageSelector";

const Header = () => (
  <View
    className={`h-[48px] px-1 flex-row justify-between border-b border-gray-300 bg-white pr-11`}
  >
    <View>
      <Image
        source={require("../../assets/images/ONDC-pure-logo.png")}
        style={{ width: 180, height: 40 }}
      />
    </View>
    <LanguageSelector />
  </View>
);
export default Header;
