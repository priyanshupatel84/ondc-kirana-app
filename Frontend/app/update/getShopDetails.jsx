import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const getShopDetails = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

  useEffect(() => {
    fetchShopDetails();
  }, []);

  const fetchShopDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/shops/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setShopDetails(response.data.shop);
      }
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch shop details");
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    try {
      const [hours, minutes] = time.split(":");
      const formattedHours = parseInt(hours) % 12 || 12;
      const period = parseInt(hours) >= 12 ? "PM" : "AM";
      return `${formattedHours}:${minutes} ${period}`;
    } catch (error) {
      return time;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">
          {t("Loading shop details...")}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text className="text-red-500 text-center text-lg mt-2">
          {t(error)}
        </Text>
      </View>
    );
  }

  if (!shopDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <MaterialIcons name="store" size={48} color="#6B7280" />
        <Text className="text-gray-600 text-center text-lg mt-2">
          {t("No shop details found")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4 space-y-4">
        {/* Shop Status Card */}
        <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <View className="flex-row items-center">
            <View className="bg-blue-100 rounded-full p-2 mr-3">
              <MaterialIcons
                name={shopDetails.isLiveShop ? "store" : "store-mall-directory"}
                size={24}
                color="#3B82F6"
              />
            </View>
            <View>
              <Text className="text-blue-800 font-medium text-lg">
                {shopDetails.isLiveShop ? t("Live Shop") : t("Shop Offline")}
              </Text>
              <Text className="text-blue-600">
                {shopDetails.isLiveShop
                  ? t("Your shop is live and accepting orders")
                  : t("Your shop is currently offline")}
              </Text>
            </View>
          </View>
        </View>

        {/* Shop Logo and Basic Info */}
        <View className="bg-white rounded-xl shadow-sm p-5">
          <View className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
            <Image
              source={{
                uri: shopDetails.logo,
              }}
              className="w-full h-56"
              resizeMode="contain"
            />
          </View>
          <Text className="text-xl font-bold text-gray-800 mt-1">
            {shopDetails.name}
          </Text>
        </View>

        {/* Address Details */}
        <View className="bg-white rounded-xl shadow-sm p-5">
          <View className="flex-row items-center border-b border-gray-100 pb-2 mb-4">
            <MaterialIcons name="location-city" size={24} color="#3B82F6" />
            <Text className="text-xl font-bold text-gray-800 ml-2">
              {t("Address Details")}
            </Text>
          </View>
          <View className="space-y-4">
            <DetailRow
              icon="location-on"
              label="Location"
              value={shopDetails.location}
              iconBg="bg-red-50"
              iconColor="#EF4444"
              t={t}
            />
          </View>
          <View className="space-y-4">
            <DetailRow
              icon="location-city"
              label="City"
              value={shopDetails.city}
              iconBg="bg-pink-50"
              iconColor="#EC4899"
              t={t}
            />
            <DetailRow
              icon="pin-drop"
              label="PIN Code"
              value={shopDetails.pinCode}
              iconBg="bg-purple-50"
              iconColor="#9333EA"
              t={t}
            />
            <DetailRow
              icon="map"
              label="State"
              value={shopDetails.state}
              iconBg="bg-blue-50"
              iconColor="#3B82F6"
              t={t}
            />
            <DetailRow
              icon="public"
              label="Country"
              value={shopDetails.country}
              iconBg="bg-green-50"
              iconColor="#10B981"
              t={t}
            />
            <DetailRow
              icon="my-location"
              label="Service Area"
              value={shopDetails.locationAvailability}
              iconBg="bg-purple-50"
              iconColor="#9333EA"
              t={t}
            />
            {shopDetails.customRadius && (
              <DetailRow
                icon="radio-button-checked"
                label="Custom Radius"
                value={`${shopDetails.customRadius} km`}
                iconBg="bg-indigo-50"
                iconColor="#6366F1"
                t={t}
              />
            )}
          </View>
        </View>

        {/* Contact Information */}
        <View className="bg-white rounded-xl shadow-sm p-5">
          <View className="flex-row items-center border-b border-gray-100 pb-2 mb-4">
            <MaterialIcons name="contact-phone" size={24} color="#3B82F6" />
            <Text className="text-xl font-bold text-gray-800 ml-2">
              {t("Contact Information")}
            </Text>
          </View>

          <View className="space-y-4">
            <DetailRow
              icon="email"
              label="Support Email"
              value={shopDetails.supportEmail}
              iconBg="bg-amber-50"
              iconColor="#F59E0B"
              t={t}
            />
            <DetailRow
              icon="phone"
              label="Support Mobile"
              value={shopDetails.supportMobile}
              iconBg="bg-emerald-50"
              iconColor="#10B981"
              t={t}
            />
          </View>
        </View>

        {/* Business Hours */}
        <View className="bg-white rounded-xl shadow-sm p-5">
          <View className="flex-row items-center border-b border-gray-100 pb-2 mb-4">
            <MaterialIcons name="access-time" size={24} color="#3B82F6" />
            <Text className="text-xl font-bold text-gray-800 ml-2">
              {t("Business Hours")}
            </Text>
          </View>

          <View className="space-y-4">
            <DetailRow
              icon="wb-sunny"
              label="Opening Time"
              value={formatTime(shopDetails.openingTime)}
              iconBg="bg-yellow-50"
              iconColor="#F59E0B"
              t={t}
            />
            <DetailRow
              icon="nights-stay"
              label="Closing Time"
              value={formatTime(shopDetails.closingTime)}
              iconBg="bg-indigo-50"
              iconColor="#6366F1"
              t={t}
            />
          </View>
        </View>

        {/* Shop Settings */}
        <View className="bg-white rounded-xl shadow-sm p-5">
          <View className="flex-row items-center border-b border-gray-100 pb-2 mb-2">
            <MaterialIcons name="settings" size={24} color="#3B82F6" />
            <Text className="text-xl font-bold text-gray-800 ml-2">
              {t("Shop Settings")}
            </Text>
          </View>

          <View className="m-1">
            <SwitchRow
              label="Default Cancellable"
              value={shopDetails.defaultCancellableSetting}
              t={t}
            />
            <SwitchRow
              label="Default Returnable"
              value={shopDetails.defaultReturnableSetting}
              t={t}
            />
          </View>
        </View>

        {/* Categories */}
        <View className="bg-white rounded-xl shadow-sm p-5">
          <View className="flex-row items-center border-b border-gray-100 pb-2 mb-4">
            <MaterialIcons name="category" size={24} color="#3B82F6" />
            <Text className="text-xl font-bold text-gray-800 ml-2">
              {t("Product Categories")}
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {shopDetails.productCategories.map((category, index) => (
              <View key={index} className="bg-blue-50 px-3 py-1 rounded-full">
                <Text className="text-blue-800">{t(category)}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
  iconBg = "bg-blue-50",
  iconColor = "#3B82F6",
  t,
}) => (
  <View className="flex-row items-center py-2">
    <View className={`${iconBg} p-3 rounded-full mr-4`}>
      <MaterialIcons name={icon} size={22} color={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-gray-500 text">{t(label)}</Text>
      <Text className="text-gray-900 font-semibold text-base">{value}</Text>
    </View>
  </View>
);

const SwitchRow = ({ label, value, t }) => (
  <View className="flex-row items-center justify-between py-2">
    <Text className="text-gray-700 font-medium">{t(label)}</Text>
    <Switch value={value} disabled={true} />
  </View>
);

export default getShopDetails;
