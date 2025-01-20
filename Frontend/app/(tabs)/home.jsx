import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ShopStatus from "../(shopDetails)/components/ShopStatus";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const StatCard = ({ title, value, subValue, onPress, t }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className={`bg-white p-5 w-[49%] shadow-sm rounded-xl`}
  >
    <View>
      <Text className="text-gray-800 text font-medium">{t(title)}</Text>
      <Text className="text-gray-900 text-3xl font-bold mt-1">
        {typeof value === "number" ? value : value}
      </Text>

      {subValue && (
        <View>
          <Text className="text-gray-600 text">{t(subValue)}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const AlertCard = ({ item, onRestock, t }) => (
  <View className="bg-red-50 py-1 px-3 rounded-xl mb-2 border border-red-100">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <MaterialIcons
          name="error-outline"
          size={20}
          color="#EF4444"
          style={{ marginRight: 8 }}
        />
        <View>
          <Text className="font-semibold text-gray-800">{item.name}</Text>
          <Text className="text-sm text-red-600">
            {t("Only ")} {item.quantity} {t(" units left")}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        className="bg-white px-3 py-2 rounded-lg border border-red-500"
        onPress={() => onRestock(item.id)}
      >
        <Text className="text-red-500 font-medium">{t("Restock")}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const QuickActionCard = ({
  title,
  subtitle,
  icon,
  onPress,
  bgColor = "bg-gray-50",
  t,
}) => (
  <TouchableOpacity
    className={`${bgColor} p-4 rounded-xl w-[49%] shadow-sm border border-gray-400`}
    onPress={onPress}
  >
    <View className="flex-row items-center mb-2">{icon}</View>
    <Text className="text-gray-800 font-medium text-lg">{t(title)}</Text>
    <Text className="text-gray-600 text-sm mt-1">{t(subtitle)}</Text>
  </TouchableOpacity>
);

const Home = () => {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const router = useRouter();
  const [isLiveShop, setIsLiveShop] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

  const STOCK_THRESHOLD = 3;

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/product/inventory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const lowStockProducts = response.data.products
          .filter((product) => product.stock <= STOCK_THRESHOLD)
          .map((product) => ({
            id: product.id,
            name: product.name,
            quantity: product.stock,
          }));
        setLowStockItems(lowStockProducts);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const stats = {
    todayOrders: 0,
    totalSales: 0.0,
    pendingOrders: 3,
    totalProducts: 0,
    avgOrderValue: 0,
    mostSoldItem: "Product X",
    deliveryPending: 3,
  };

  const msg = {
    formLabels: {
      liveShopStatus: "Shop Status",
    },
    shopStatus: {
      live: "Your store is open for orders",
      offline: "Your store is currently closed",
    },
  };

  const fetchShopStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/shops/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setIsLiveShop(response.data.shop.isLiveShop);
      }
    } catch (error) {
      console.error("Error fetching shop status:", error);
    }
  };

  const updateShopStatus = async (newStatus) => {
    try {
      await axios.patch(
        `${API_URL}/api/shops/update`,
        {
          isLiveShop: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLiveShop(newStatus);
    } catch (error) {
      console.error("Error updating shop status:", error);
      setIsLiveShop(!newStatus);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchInventory();
        fetchShopStatus();
      }
    }, [token])
  );

  const handleRestock = (productId) => {
    router.push({
      pathname: "../(catalog)/productEdit",
      params: { id: productId },
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Section with Shop Status */}
      <View className="bg-white ">
        <View className="px-3 pt-1">
          <Text className="text-lg text-gray-800">
            {t("Hello")}, {user?.name} 👋
          </Text>
        </View>

        <View className="flex-row justify-between px-2 pt-2 pb-2">
          <View className="flex-1 mr-2">
            <ShopStatus
              isLiveShop={isLiveShop}
              onChange={updateShopStatus}
              msg={msg}
            />
          </View>
          <TouchableOpacity
            className="bg-gray-100 py-3 px-5 rounded-xl flex-row items-center self-stretch border border-gray-400"
            onPress={() => router.push("../(shopDetails)/updateShop")}
          >
            <Ionicons name="settings-outline" size={40} color="#374151" />
            <View className="ml-2">
              <Text className="text-gray-700 text-center text-md font-semibold">
                {t("Shop")}
              </Text>
              <Text className="text-gray-700 text-center text-md font-semibold">
                {t("Setting")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="p-2">
        {/* Today's Performance */}
        <View className=" bg-blue-500 p-2 rounded-2xl mb-3">
          <Text className="text-lg px-2 font-semibold mb-3 text-white">
            {t("Today's Performance")}
          </Text>
          <View className="flex-row flex-wrap rounded-xl justify-between item-center">
            <StatCard
              title="Orders"
              value={stats.todayOrders}
              subValue="3 pending"
              onPress={() => router.push("(tabs)/order")}
              t={t}
            />
            <StatCard
              title="Sales"
              value={`₹${stats.totalSales}`}
              subValue="Avg. ₹0 per order"
              t={t}
            />
          </View>
        </View>

        {/*Priority Alerts */}
        {lowStockItems.length > 0 && (
          <View className="">
            <Text className="text-lg px-1 font-semibold mb-2">
              {t("Priority Alerts")}
            </Text>
            {lowStockItems.map((item) => (
              <AlertCard
                key={item.id}
                item={item}
                onRestock={handleRestock}
                t={t}
              />
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2 px-1">
            {t("Quick Actions")}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <QuickActionCard
              title="Add Product"
              subtitle="Expand your catalog"
              icon={<MaterialIcons name="add-box" size={36} color="#059669" />}
              onPress={() => router.push("../(catalog)/catalogIndex")}
              bgColor="bg-green-50"
              t={t}
            />
            <QuickActionCard
              title="Inventory"
              subtitle="Manage your stock"
              icon={
                <MaterialIcons name="inventory" size={36} color="#2563EB" />
              }
              onPress={() => router.push("../(inventory)/inventoryIndex")}
              bgColor="bg-blue-50"
              t={t}
            />
            <QuickActionCard
              title="Returns"
              subtitle={`${stats.pendingOrders} pending`}
              icon={
                <MaterialIcons
                  name="assignment-return"
                  size={36}
                  color="#DC2626"
                />
              }
              onPress={() => router.push("../(return)/returnIndex")}
              bgColor="bg-red-50"
              t={t}
            />
            <QuickActionCard
              title="Support"
              subtitle="Handle Customer issues"
              icon={
                <MaterialIcons name="support-agent" size={36} color="#7C3AED" />
              }
              onPress={() => router.push("/(complaints)/complaintsIndex")}
              bgColor="bg-purple-50"
              t={t}
            />

            <TouchableOpacity
              className="w-full bg-yellow-50 p-5 py-8 rounded-xl flex-row justify-between items-center border border-gray-400"
              onPress={() => router.push("../myComponent/tutorial")}
            >
              <View className="flex-row items-center">
                <MaterialIcons
                  name="play-circle-filled"
                  size={28}
                  color="#F59E0B"
                />
                <View className="ml-3">
                  <Text className="text-gray-800 font-semibold text-lg">
                    {t("Tutorial")}
                  </Text>
                  <Text className="text-gray-600 text">
                    {t("Learn how to use the app")}
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={20}
                color="#374151"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
