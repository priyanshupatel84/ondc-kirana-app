import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import search icon

const productsData = [
  {
    id: "1",
    name: "Apple dsbff dfdifdbf fidbgfgfgfgfdibf fudfiudf fudu fbdufu fudfdufb ",
    category: "Grocery",
    stock: 10,
    orders: 20, // Number of orders
  },
  { id: "2", name: "Shampoo", category: "Beauty", stock: 5, orders: 12 },
  { id: "3", name: "Football", category: "Sports", stock: 8, orders: 150 },
  { id: "4", name: "Banana", category: "Grocery", stock: 0, orders: 5 },
  { id: "5", name: "Lotion", category: "Beauty", stock: 2, orders: 8 },
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState(""); // For the search input

  // Filter products based on search term (searching in both name and category)
  const filteredProducts = productsData.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  });

  // Render each product item
  const renderItem = ({ item }) => (
    <View className="flex-row border-b border-gray-300 justify-between bg-blue-50 p-1 my-1 rounded-lg">
      {/* Image and stock info */}
      <View className="h-22 w-1/5 relative border rounded-lg">
        <Image
          source={require("../../assets/images/seller-photo.png")}
          style={{ width: 70, height: 75 }}
        />
      </View>

      {/* Product name and category */}
      <View className="w-3/5 py-1 px-[4px] rounded-lg">
        <Text className="font-semibold">{item.name}</Text>
        <Text className="text-gray-600">{item.category}</Text>
      </View>

      {/* Edit button */}
      <View className="w-[19%] rounded flex justify-center gap-2">
        <TouchableOpacity className="bg-blue-500 px-1 py-1 rounded-lg">
          <Text className="text-white text-center">Update</Text>
        </TouchableOpacity>

        <Text className="text-gray-600 bg-white rounded text-center">
          {item.stock > 0 ? `Stock: ${item.stock}` : "Stock ❌"}
        </Text>
        <Text className="text-gray-600 bg-white rounded text-center">
          {`Orders: ${item.orders}`} {/* Display number of orders */}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 py-3 px-2 bg-white">
      {/* Search input with icon */}
      <View className="relative mx-1">
        <TextInput
          className="h-14 border border-gray-800 mb-4 p-4 pl-12 rounded-xl bg-white" // Add padding-left for icon space
          placeholder="Search products by name or category..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Ionicons
          name="search-outline"
          size={24}
          color="gray"
          style={{
            position: "absolute",
            top: "40%",
            left: "03%",
            transform: [{ translateY: -12 }],
          }}
        />
      </View>

      {/* Render filtered products */}
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Index;
