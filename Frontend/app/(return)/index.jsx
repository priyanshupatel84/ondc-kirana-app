import React from "react";
import { View, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useTranslation } from "react-i18next";

// Sample data for incoming returns to the seller
const incomingReturnsData = [
  {
    id: "RET001",
    userName: "Priya Sharma",
    productName: "Basmati Rice (5kg)",
    quantity: 1,
    category: "Grocery",
    expectedArrivalDate: "2024-02-05",
    expectedArrivalTime: "10:00 AM - 12:00 PM",
    returnReason: "Quality Concern",
    courierPartner: "BlueDart",
    trackingNumber: "BD987654321",
    status: "Pending",
  },
  {
    id: "RET002",
    userName: "Rajesh Patel",
    productName: "Turmeric Powder (200g)",
    quantity: 2,
    category: "Spices",
    expectedArrivalDate: "2024-01-25",
    expectedArrivalTime: "02:00 PM - 04:00 PM",
    returnReason: "Packaging Damage",
    courierPartner: "Delhivery",
    trackingNumber: "DL123456789",
    status: "Delayed",
  },
  {
    id: "RET003",
    userName: "Anjali Gupta",
    productName: "Ghee (500ml)",
    quantity: 1,
    category: "Dairy",
    expectedArrivalDate: "2024-02-07",
    expectedArrivalTime: "11:00 AM - 01:00 PM",
    returnReason: "Leaking Packaging",
    courierPartner: "Shadowfax",
    trackingNumber: "SF456789123",
    status: "In Transit",
  },
];

const IncomingReturnsPage = () => {
  const { t } = useTranslation();
  const getStatusDetails = (status) => {
    switch (status) {
      case "Pending":
        return {
          text: t("Pending"),
          color: "text-yellow-800",
          bg: "bg-yellow-100",
          icon: "#CA8A04",
        };
      case "Delayed":
        return {
          text: t("Delayed"),
          color: "text-red-800",
          bg: "bg-red-100",
          icon: "#DC2626",
        };
      case "In Transit":
        return {
          text: t("In Transit"),
          color: "text-blue-800",
          bg: "bg-blue-100",
          icon: "#2563EB",
        };
      default:
        return {
          text: t("Unknown"),
          color: "text-gray-800",
          bg: "bg-gray-100",
          icon: "#4B5563",
        };
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-2">
        <View className="bg-red-100 border border-red-200 p-2 mb-4 rounded-lg">
          <Text className="text-base text-red-800 text-center">
            🚨{t(" Not Connected to Backend, just for DEMO ")}🚨
          </Text>
        </View>
        <View className="mb-3 px-1">
          <Text className="text-2xl font-bold text-gray-900">
            {t("Incoming Returns")}
          </Text>
          <Text className="text-base text-gray-600">
            {t("Track products expected to be returned")}
          </Text>
        </View>

        <View>
          {incomingReturnsData.map((returnItem) => {
            const statusDetails = getStatusDetails(returnItem.status);
            return (
              <Card
                key={returnItem.id}
                className="border border-gray-800 mb-2 bg-white"
              >
                <CardHeader className="p-4 pb-2 flex-row justify-between items-center">
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-lg text-gray-900">
                      {t("Return")} #{returnItem.id}
                    </Text>
                    <View
                      className={`flex-row items-center px-2 py-1 mx-2 rounded-full ${statusDetails.bg}`}
                    >
                      {returnItem.status === "Pending" && (
                        <MaterialIcons
                          name="pending"
                          size={16}
                          color={statusDetails.icon}
                        />
                      )}
                      {returnItem.status === "Delayed" && (
                        <MaterialIcons
                          name="warning"
                          size={16}
                          color={statusDetails.icon}
                        />
                      )}
                      {returnItem.status === "In Transit" && (
                        <MaterialIcons
                          name="local-shipping"
                          size={16}
                          color={statusDetails.icon}
                        />
                      )}
                      <Text
                        className={`ml-2 text-sm font-medium ${statusDetails.color}`}
                      >
                        {statusDetails.text}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm text-gray-500">
                    {returnItem.expectedArrivalDate}
                  </Text>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <View className="space-y-2">
                    <View>
                      <Text className="text-base font-medium text-gray-900">
                        {t("Customer")}: {returnItem.userName}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-base font-medium text-gray-900">
                        {t("Product Details")}
                      </Text>
                      <Text className="text-base text-gray-600">
                        {returnItem.productName} x {returnItem.quantity}
                      </Text>
                      <Text className="text-base text-gray-600">
                        {t("Category")}: {returnItem.category}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-base font-medium text-gray-900">
                        {t("Return Details")}
                      </Text>
                      <Text className="text-base text-gray-600">
                        {t("Expected Time")}: {returnItem.expectedArrivalTime}
                      </Text>
                      <Text className="text-base text-gray-600">
                        {t("Return Reason")}: {returnItem.returnReason}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-base font-medium text-gray-900">
                        {t("Shipping Information")}
                      </Text>
                      <Text className="text-base text-gray-600">
                        {t("Courier")}: {returnItem.courierPartner}
                      </Text>
                      <Text className="text-base text-gray-600">
                        {t("Tracking Number")}: {returnItem.trackingNumber}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default IncomingReturnsPage;
