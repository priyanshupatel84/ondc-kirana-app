// import React from "react";
// import { View, Image, TouchableOpacity, Text } from "react-native";
// import LanguageSelector from "./languageSelector";
// import { useAuth } from "../context/AuthContext";

// const Header = () => {
//   const { logout } = useAuth();

//   return (
//     <View
//       className={`h-[51px] p-[1px] px-1 flex-row justify-between items-center border-b border-gray-300 bg-white`}
//     >
//       <View>
//         <Image
//           source={require("../../assets/images/ONDC-pure-logo.png")}
//           style={{ width: 190, height: 42 }}
//         />
//       </View>
//       <View className="flex-row items-center gap-2">
//         <LanguageSelector />
//         <TouchableOpacity
//           onPress={logout}
//           className="px-3 py-1 bg-red-500 rounded-md"
//         >
//           <Text className="text-white text-sm font-medium">Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Header;

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
