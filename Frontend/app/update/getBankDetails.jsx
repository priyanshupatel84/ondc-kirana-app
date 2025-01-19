import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

const BankDetails = () => {
  const { token } = useAuth();
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bank-account/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setBankDetails(response.data.bankDetails);
      }
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch bank details");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading bank details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text className="text-red-500 text-center text-lg mt-2">{error}</Text>
      </View>
    );
  }

  if (!bankDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <MaterialIcons name="account-balance" size={48} color="#6B7280" />
        <Text className="text-gray-600 text-center text-lg mt-2">
          No bank details found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4 space-y-4">
        {/* Status Card */}
        <View className="bg-green-50 rounded-xl p-4 border border-green-200">
          <View className="flex-row items-center">
            <View className="bg-green-100 rounded-full p-2 mr-3">
              <MaterialIcons name="verified" size={24} color="#10B981" />
            </View>
            <View>
              <Text className="text-green-800 font-medium text-lg">
                Verified Account
              </Text>
              <Text className="text-green-600">
                Your bank account is verified and active
              </Text>
            </View>
          </View>
        </View>

        {/* Main Details Card */}
        <View className="bg-white rounded-xl shadow-sm p-5">
          <View className="flex-row items-center border-b border-gray-100 pb-2 mb-2">
            <MaterialIcons name="account-balance" size={28} color="#3B82F6" />
            <View className="ml-3">
              <Text className="text-xl font-bold text-gray-800">
                Bank Account Details
              </Text>
              <Text className="text-gray-500">Primary Account Information</Text>
            </View>
          </View>

          <View>
            <DetailRow
              icon="person"
              label="Account Holder"
              value={bankDetails.accountHolderName}
              iconBg="bg-blue-50"
            />
            <DetailRow
              icon="credit-card"
              label="Account Number"
              value={bankDetails.accountNumber}
              iconBg="bg-purple-50"
              iconColor="#9333EA"
            />
            <DetailRow
              icon="business"
              label="Bank Name"
              value={bankDetails.bankName}
              iconBg="bg-indigo-50"
              iconColor="#6366F1"
            />
            <DetailRow
              icon="vpn-key"
              label="IFSC Code"
              value={bankDetails.ifscCode}
              iconBg="bg-pink-50"
              iconColor="#EC4899"
            />
            <DetailRow
              icon="location-city"
              label="Branch Name"
              value={bankDetails.branchName}
              iconBg="bg-amber-50"
              iconColor="#F59E0B"
            />
          </View>
        </View>

        {/* Cancelled Cheque Image Card */}
        <View className="bg-white rounded-xl shadow-sm p-2 mt-1">
          <View className="flex-row items-center mb-4">
            <MaterialIcons name="image" size={24} color="#3B82F6" />
            <Text className="text-xl font-bold text-gray-800 ml-2">
              Cancelled Cheque
            </Text>
          </View>
          <View className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
            <Image
              source={{
                uri: bankDetails.cancelledChequeImage,
              }}
              className="w-full h-56"
              resizeMode="contain"
            />
          </View>
          <Text className="text-gray-500  mt-2 text-center">
            Uploaded cancelled cheque for verification purposes
          </Text>
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
}) => (
  <View className="flex-row items-center">
    <View className={`${iconBg} p-3 rounded-full mr-4`}>
      <MaterialIcons name={icon} size={22} color={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-gray-900 text-md">{label}</Text>
      <Text className="text-black font-semibold text-lg">{value}</Text>
    </View>
  </View>
);

export default BankDetails;
