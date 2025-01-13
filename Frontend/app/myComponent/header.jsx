import React from "react";
import { View, Image } from "react-native";
import LanguageSelector from "./languageSelector";

const Header = () => (
  <View
    className={`h-[51px] p-[1px] px-1 flex-row justify-between border-b border-gray-300 bg-white`}
  >
    <View>
      <Image
        source={require("../../assets/images/ONDC-pure-logo.png")}
        style={{ width: 190, height: 42 }}
      />
    </View>
    <LanguageSelector />
  </View>
);
export default Header;
