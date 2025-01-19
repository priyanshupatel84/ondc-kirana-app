import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useRouter } from "expo-router";

const Profile = () => {
  const { user, logout, token } = useAuth();
  const [inventorySize, setInventorySize] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shopDetails, setShopDetails] = useState(null);
  const [isLoadingShop, setIsLoadingShop] = useState(true);
  const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

  const fetchShopDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/shops/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setShopDetails(response.data.shop);
      }
    } catch (error) {
      console.error("Error fetching shop details:", error);
      Alert.alert(
        error.response?.status === 404 ? "Shop Not Found" : "Error",
        error.response?.status === 404
          ? "Please set up your shop first to view shop details."
          : "Failed to fetch shop details. Please check your connection and try again."
      );
    } finally {
      setIsLoadingShop(false);
    }
  };

  const fetchInventorySize = async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get(`${API_URL}/api/product/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setInventorySize(
          response.data.products.reduce(
            (sum, product) => sum + product.stock,
            0
          )
        );
        setTotalProducts(response.data.products.length);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      Alert.alert("Error", "Failed to fetch inventory. Please try again.", [
        { text: "Retry", onPress: fetchInventorySize },
        { text: "OK" },
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventorySize();
    fetchShopDetails();
  }, []);

  const StatCard = ({ title, value, color, icon }) => (
    <View
      className={`flex-1 bg-${color}-50 p-3 border border-gray-300 rounded-2xl`}
    >
      <View className="flex-row items-center space-x-2">
        <MaterialIcons
          name={icon}
          size={24}
          color={`#${
            color === "blue"
              ? "3B82F6"
              : color === "green"
              ? "10B981"
              : "8B5CF6"
          }`}
        />
        <Text className={`text-${color}-800 font-medium`}>{title}</Text>
      </View>
      <Text className={`text-3xl font-bold text-center text-${color}-900 mt-3`}>
        {value}
      </Text>
    </View>
  );

  const VerificationItem = ({ title, icon }) => {
    const router = useRouter();

    const handleView = () => {
      switch (title) {
        case "Bank Account":
          router.push("../update/getBankDetails");
          break;
        case "KYC Verified":
          router.push("../update/getKYCDetails");
          break;
        case "Store Details":
          router.push("../update/getShopDetails");
          break;
        default:
          break;
      }
    };

    const handleEdit = () => {
      switch (title) {
        case "Bank Account":
          router.push("../update/bankDetails");
          break;
        case "KYC Verified":
          router.push("../update/kycDetails");
          break;
        case "Store Details":
          router.push("../update/storeDetails");
          break;
        default:
          break;
      }
    };

    return (
      <View className="flex-row items-center justify-between py-1 border-b border-gray-500 last:border-b-0">
        <View className="flex-row items-center space-x-3">
          <View className="bg-green-50 p-2 rounded-full">
            <MaterialIcons name={icon} size={20} color="#10B981" />
          </View>
          <Text className="text-black font-medium">{title}</Text>
        </View>
        <View className="flex-row space-x-2">
          {title === "Bank Account" && (
            <TouchableOpacity
              className="bg-blue-500 px-4 py-1 mr-2 rounded-xl border border-gray-300"
              onPress={handleEdit}
            >
              <Text className="text-white font-medium">Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="bg-white px-4 py-1 rounded-xl border border-black"
            onPress={handleView}
          >
            <Text className="text-black font-medium">View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={fetchInventorySize}
        />
      }
    >
      {/* Header */}
      <View className="bg-white shadow-sm px-4 py-2 mb-1">
        <View className="flex-row justify-between items-center bg-blue-100 p-1 pl-3 rounded-2xl">
          <View className="flex-row items-center space-x-2 ">
            <Text className="text-2xl font-bold text-gray-800 mr-1">
              Profile
            </Text>
            <TouchableOpacity
              onPress={fetchInventorySize}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color="#3B82F6" />
              ) : (
                <MaterialIcons name="refresh" size={24} color="#3B82F6" />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-red-500 rounded-2xl px-5 py-2.5 flex-row items-center space-x-2"
            onPress={logout}
          >
            <MaterialIcons name="logout" size={20} color="white" />
            <Text className="text-white font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-2 space-y-1">
        {/* User Profile Card */}
        <View className=" rounded-2xl shadow-sm p-2 bg-white">
          <View className="flex-row ">
            <View className="w-1/2 p-1 h-auto border-2 border-gray-300 rounded-2xl">
              <Image
                source={
                  shopDetails?.logo
                    ? { uri: shopDetails.logo }
                    : {
                        uri: "https://media.licdn.com/dms/image/v2/D4D12AQG2NBfxR6rkQA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1684170906726?e=2147483647&v=beta&t=t-rqwscxPIJvPa6FRqgkFASZ98eaJ0YuFkkIh8xM3ME",
                      }
                }
                resizeMode="contain"
                className="w-full aspect-square rounded-2xl"
              />
            </View>
            <View className="ml-4 flex-1 justify-center">
              <Text>Full Name : </Text>
              <Text className="text-2xl font-bold text-blue-600 mb-1">
                {user?.name}
              </Text>
              <Text>Email</Text>
              <Text className="text-blue-600  text-md mb-1">{user?.email}</Text>
              <Text>Mobile No.</Text>
              <Text className="text-blue-600 text-md">{user?.mob_no}</Text>
            </View>
          </View>
        </View>

        {/* Shop Details */}
        {isLoadingShop ? (
          <View className="bg-white rounded-3xl shadow-sm p-2 items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <View className="bg-white rounded-xl shadow-sm p-2 pt-1">
            <View className="mb-2">
              <Text className="text-lg font-bold text-gray-800 text-center">
                {shopDetails.name}
              </Text>
            </View>

            <View>
              {[
                { icon: "location-on", text: shopDetails.location },
                { icon: "email", text: shopDetails.supportEmail },
                { icon: "phone", text: shopDetails.supportMobile },
              ].map((item, index) => (
                <View key={index} className="flex-row items-center ">
                  <View className="bg-blue-50 p-2 rounded-full mx-2 my-1 ">
                    <MaterialIcons name={item.icon} size={18} color="#3B82F6" />
                  </View>
                  <Text className="text-gray-600 flex-1">{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {/* Stats */}
        <View className="flex-row gap-1 p-1 my-1">
          <StatCard
            title="Total Stock"
            value={inventorySize}
            color="blue"
            icon="inventory"
          />
          <StatCard
            title="Products"
            value={totalProducts}
            color="yellow"
            icon="category"
          />
          <StatCard
            title="Orders"
            value="0"
            color="purple"
            icon="shopping-bag"
          />
        </View>
        {/* Verification Status */}
        <View className=" rounded-xl shadow-sm p-2 mt-2 bg-green-50 border border-gray-300">
          <Text className="text-xl font-bold text-gray-800">
            Verification Status
          </Text>
          <VerificationItem title="Bank Account" icon="account-balance" />
          <VerificationItem title="KYC Verified" icon="verified-user" />

          <VerificationItem title="Store Details" icon="store" />
        </View>
      </View>

      {/* Bottom Padding */}
      <View className="h-8" />
    </ScrollView>
  );
};

export default Profile;
