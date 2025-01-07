import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icon library

const InventoryLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: ({ navigation }) => (
            <View className="flex-row items-center h-16 bg-blue-500 px-4">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="mr-2" // Space between back button and title
              >
                <Icon name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View className="flex-1 flex-row items-center justify-center">
                <Icon
                  name="inventory"
                  size={24}
                  color="white"
                  className="mr-2" // Space between icon and title
                />
                <Text className="font-bold text-2xl text-white">Inventory</Text>
              </View>
              <View className="w-10" />
              {/* This space can be adjusted to ensure proper centering */}
            </View>
          ),
          headerStyle: {
            height: 60, // Adjusted height for better visibility
          },
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
};

export default InventoryLayout;

// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { Stack } from "expo-router";
// import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icon library

// const InventoryLayout = () => {
//   return (
//     <Stack>
//       <Stack.Screen
//         name="index"
//         options={{
//           header: ({ navigation }) => (
//             <View style={styles.headerContainer}>
//               <TouchableOpacity
//                 onPress={() => navigation.goBack()}
//                 style={styles.backButton}
//               >
//                 <Icon name="arrow-back" size={24} color="black" />
//               </TouchableOpacity>
//               <View style={styles.titleContainer}>
//                 <Icon
//                   name="inventory"
//                   size={24}
//                   color="black"
//                   style={styles.icon}
//                 />
//                 <Text style={styles.headerTitle}>Inventory</Text>
//               </View>
//               <View style={styles.emptySpace} />{" "}
//               {/* This will push the title to the center */}
//             </View>
//           ),
//           headerStyle: {
//             backgroundColor: "#E5E7EB", // bg-gray-200
//             height: 60, // Adjusted height for better visibility
//           },
//           headerTintColor: "white",
//         }}
//       />
//     </Stack>
//   );
// };

// const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     height: 60, // Match the header height
//     paddingHorizontal: 16,
//   },
//   backButton: {
//     marginRight: 1, // Space between back button and title
//   },
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1, // Allow this container to take available space
//     justifyContent: "center", // Center the title
//   },
//   icon: {
//     marginRight: 8, // Space between icon and title
//   },
//   headerTitle: {
//     fontWeight: "bold",
//     fontSize: 25,
//     color: "black", // Change to your desired text color
//   },
//   emptySpace: {
//     width: 24, // This space can be adjusted to ensure proper centering
//   },
// });

// export default InventoryLayout;
