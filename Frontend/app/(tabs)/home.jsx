import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import ShopStatus from "../(shopDetails)/components/ShopStatus";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ title, value, trend, subValue }) => (
  <View className={`bg-white p-3 w-[49%] shadow-sm rounded-xl`}>
    <Text className="text-gray-800 text font-medium">{title}</Text>
    <Text className="text-gray-900 text-3xl font-bold mt-1">{value}</Text>
    {trend && (
      <View className="flex-row items-center ">
        {trend > 0 ? (
          <>
            <Ionicons name="trending-up" size={16} color="#059669" />
            <Text className="text-green-600 text ml-1">{trend}%</Text>
          </>
        ) : (
          <>
            <Ionicons name="trending-down" size={16} color="#DC2626" />
            <Text className="text-red-600 text ml-1">{Math.abs(trend)}%</Text>
          </>
        )}
      </View>
    )}
    {subValue && <Text className="text-gray-600 text">{subValue}</Text>}
  </View>
);

// Enhanced Alert Card for low stock items
const AlertCard = ({ item }) => (
  <View className="bg-red-50 py-2 px-3 rounded-xl mb-2 border border-red-100">
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
            Only {item.quantity} units left
          </Text>
        </View>
      </View>
      <TouchableOpacity className="bg-red-500 px-3 py-2 rounded-lg">
        <Text className="text-white font-medium">Restock</Text>
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
}) => (
  <TouchableOpacity
    className={`${bgColor} p-4 rounded-xl w-[49%] shadow-sm border border-gray-400`}
    onPress={onPress}
  >
    <View className="flex-row items-center mb-2">{icon}</View>
    <Text className="text-gray-800 font-medium text-lg">{title}</Text>
    <Text className="text-gray-600 text-sm mt-1">{subtitle}</Text>
  </TouchableOpacity>
);

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLiveShop, setIsLiveShop] = useState(false);

  // Hardcoded stats
  const stats = {
    todayOrders: 25,
    totalSales: 12500,
    pendingOrders: 5,
    totalProducts: 150,
    orderTrend: 5.2,
    saleTrend: -2.1,
    avgOrderValue: 500,
    mostSoldItem: "Product X",
    deliveryPending: 3,
  };

  // Hardcoded low stock items
  const lowStockItems = [
    { name: "Product A", quantity: 3 },
    { name: "Product B", quantity: 2 },
  ];

  // Message object for ShopStatus
  const msg = {
    formLabels: {
      liveShopStatus: "Shop Status",
    },
    shopStatus: {
      live: "Your store is open for orders",
      offline: "Your store is currently closed",
    },
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Section with Shop Status */}
      <View className="bg-white ">
        <View className="px-3 pt-1">
          <Text className="text-lg text-gray-800">Hello, {user?.name} 👋</Text>
        </View>

        <View className="flex-row justify-between px-2 pt-2 pb-2">
          <View className="flex-1 mr-2">
            <ShopStatus
              isLiveShop={isLiveShop}
              onChange={setIsLiveShop}
              msg={msg}
            />
          </View>
          <TouchableOpacity
            className="bg-gray-100 py-3 px-5 rounded-xl flex-row items-center self-stretch border border-gray-400"
            onPress={() => router.push("../(shopDetails)/configureStore")}
          >
            <Ionicons name="settings-outline" size={40} color="#374151" />
            <View className="ml-2">
              <Text className="text-gray-700 text-center text-md font-semibold">
                Shop
              </Text>
              <Text className="text-gray-700 text-center text-md font-semibold">
                Setting
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="p-2">
        {/* Today's Performance */}
        <View className="mb-3 bg-blue-500 p-2 rounded-2xl">
          <Text className="text-lg px-2 font-semibold mb-3 text-white">
            Today's Performance
          </Text>
          <View className="flex-row flex-wrap rounded-xl justify-between item-center">
            <StatCard
              title="Orders"
              value={stats.todayOrders}
              trend={stats.orderTrend}
              subValue={`${stats.pendingOrders} pending`}
            />
            <StatCard
              title="Sales"
              value={`₹${stats.totalSales}`}
              trend={stats.saleTrend}
              subValue={`Avg. ₹${stats.avgOrderValue} per order`}
            />
          </View>
        </View>

        {/* Priority Alerts */}
        {/* {lowStockItems.length > 0 && (
          <View className="mb-1">
            <Text className="text-lg px-1 font-semibold mb-2">
              Priority Alerts
            </Text>
            {lowStockItems.map((item, index) => (
              <AlertCard key={index} item={item} />
            ))}
          </View>
        )} */}

        {/* Quick Actions */}
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-3 px-1">Quick Actions</Text>
          <View className="flex-row flex-wrap gap-2">
            <QuickActionCard
              title="Add Product"
              subtitle="Expand your catalog"
              icon={<MaterialIcons name="add-box" size={36} color="#059669" />}
              onPress={() => router.push("../(catalog)")}
              bgColor="bg-green-50"
            />
            <QuickActionCard
              title="Inventory"
              subtitle="Manage your stock"
              icon={
                <MaterialIcons name="inventory" size={36} color="#2563EB" />
              }
              onPress={() => router.push("../(inventory)")}
              bgColor="bg-blue-50"
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
              onPress={() => router.push("../(return)")}
              bgColor="bg-red-50"
            />
            <QuickActionCard
              title="Support"
              subtitle="Handle Customer issues"
              icon={
                <MaterialIcons name="support-agent" size={36} color="#7C3AED" />
              }
              onPress={() => router.push("/(complaints)")}
              bgColor="bg-purple-50"
            />

            <TouchableOpacity
              className="w-full bg-yellow-50 p-6 rounded-xl flex-row justify-between items-center border border-gray-400"
              onPress={() => router.push("../myComponent/tutorial")}
            >
              <View className="flex-row items-center">
                <MaterialIcons
                  name="play-circle-filled"
                  size={28}
                  color="#F59E0B"
                />
                <View className="ml-3">
                  <Text className="text-gray-800 font-medium text-lg">
                    Tutorial
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Learn how to use the app
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
