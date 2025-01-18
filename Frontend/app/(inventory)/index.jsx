import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/product/inventory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  });

  // Handle update product
  const handleUpdate = (productId) => {
    router.push(`/(catalog)/productEdit?id=${productId}`);
  };
  // Render each product item
  const renderItem = ({ item }) => (
    <View className="flex-row border-b border-gray-300 justify-between bg-blue-50 p-1 my-1 rounded-lg">
      {/* Image */}
      <View className="h-22 w-1/5 relative border rounded-lg">
        <Image
          source={
            item.productImages
              ? { uri: item.productImages }
              : require("../../assets/images/seller-photo.png")
          }
          style={{ width: 70, height: 75 }}
          className="rounded-lg"
        />
      </View>

      {/* Product name and category */}
      <View className="w-3/5 py-1 px-[4px] rounded-lg">
        <Text className="font-semibold" numberOfLines={2}>
          {item.name}
        </Text>
        <Text className="text-gray-600">{item.category}</Text>
        <Text className="text-gray-600">₹{item.price}</Text>
        <Text className="text-gray-600" numberOfLines={1}>
          {item.description}
        </Text>
      </View>

      {/* Edit button and stats */}
      <View className="w-[19%] rounded flex justify-center gap-2">
        <TouchableOpacity
          className="bg-blue-500 px-1 py-1 rounded-lg"
          onPress={() => handleUpdate(item.id)}
        >
          <Text className="text-white text-center">Update</Text>
        </TouchableOpacity>

        <Text className="text-gray-600 bg-white rounded text-center">
          {item.stock > 0 ? `Stock: ${item.stock}` : "Stock ❌"}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 py-3 px-2 bg-white">
      {/* Search input with icon */}
      <View className="relative mx-1">
        <TextInput
          className="h-14 border border-gray-800 mb-4 p-4 pl-12 rounded-xl bg-white"
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

      {/* Products list */}
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-4">
            No products found
          </Text>
        }
      />
    </View>
  );
};

export default Index;
