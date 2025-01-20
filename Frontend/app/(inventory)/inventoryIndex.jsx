import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { handleDelete } from "./handleDelete";
import { SkeletonLoader } from "./ProductSkeleton";
import { useTranslation } from "react-i18next";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const Index = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

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
      Alert.alert(
        "Error",
        "Failed to fetch products. Please check your connection and try again.",
        [{ text: "Retry", onPress: () => fetchProducts() }, { text: "OK" }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  });

  const handleUpdate = (productId) => {
    router.push(`/(catalog)/productEdit?id=${productId}`);
  };

  const handleDeleteProduct = (productId) =>
    handleDelete(productId, token, fetchProducts);

  const StockBadge = ({ stock }) => (
    <View
      className={`rounded-full px-3 py-1 ${
        stock > 0 ? "bg-green-100" : "bg-red-100"
      }`}
    >
      <Text className={`text ${stock > 0 ? "text-green-800" : "text-red-800"}`}>
        {stock > 0 ? `${stock} ${t("in stock")}` : t("Out of stock")}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View className=" rounded-xl shadow-sm px-2 py-1 mx-2 my-1 bg-white border border-gray-300">
      <View className="flex-row p-2 border-b border-gray-300">
        {/* Image */}
        <View className="mr-4">
          <Image
            source={{ uri: item.productImages }}
            style={{ width: 100, height: 100 }}
            className="rounded-lg"
          />
        </View>

        {/* Product Details */}
        <View className="flex-1 justify-between">
          <View>
            <Text className="text-lg font-bold" numberOfLines={2}>
              {item.name}
            </Text>
            <Text className="text-gray-600 text-sm mb-1">{item.category}</Text>
            <Text className="text-xl font-semibold text-blue-600 mb-1">
              ₹{item.price.toLocaleString()}
            </Text>
            <Text className="text-gray-500 text-sm" numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View className="flex-row justify-between items-center p-1 pt-2 ">
        <StockBadge stock={item.stock} />

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="bg-blue-50 px-3 py-1 rounded-lg flex-row items-center"
            onPress={() => handleUpdate(item.id)}
          >
            <MaterialIcons name="edit" size={16} color="#1D4ED8" />
            <Text className="text-blue-700 ml-1 font-medium">{t("Edit")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-50 px-3 py-1 rounded-lg flex-row items-center"
            onPress={() => handleDeleteProduct(item.id)}
          >
            <MaterialIcons name="delete-outline" size={16} color="#DC2626" />
            <Text className="text-red-700 ml-1 font-medium">{t("Delete")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Header */}
      <View className="bg-white px-4 py-3 ">
        <View className="relative border border-gray-800 rounded-xl bg-gray-50">
          <TextInput
            className="h-12 bg-gray-50 px-12 rounded-xl text-base"
            placeholder="Search products..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Ionicons
            name="search-outline"
            size={20}
            color="gray"
            style={{
              position: "absolute",
              top: "50%",
              left: 16,
              transform: [{ translateY: -10 }],
            }}
          />
          {searchTerm ? (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: "50%",
                right: 16,
                transform: [{ translateY: -10 }],
              }}
              onPress={() => setSearchTerm("")}
            >
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Products List */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#1D4ED8"]}
            />
          }
          contentContainerStyle={{ paddingVertical: 8 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-8">
              <MaterialIcons name="inventory" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4 text-center">
                {searchTerm
                  ? t("No products found matching your search")
                  : t("No products in inventory")}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default Index;
