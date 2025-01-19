import { View, Text, ActivityIndicator, Image, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

const getKYCDetails = () => {
  const { token, user } = useAuth();
  const [kycDetails, setKYCDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

  useEffect(() => {
    fetchKYCDetails();
  }, []);

  const fetchKYCDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/kyc/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setKYCDetails(response.data.kyc);
      }
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch KYC details");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading KYC details...</Text>
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

  if (!kycDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <MaterialIcons name="description" size={48} color="#6B7280" />
        <Text className="text-gray-600 text-center text-lg mt-2">
          No KYC details found
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
              <MaterialIcons
                name={user?.isDocumentVerified ? "verified" : "pending"}
                size={24}
                color="#10B981"
              />
            </View>
            <View>
              <Text className="text-green-800 font-medium text-lg">
                {user?.isDocumentVerified ? "Verified KYC" : "KYC Pending"}
              </Text>
              <Text className="text-green-600">
                {user?.isDocumentVerified
                  ? "Your KYC verification is complete"
                  : "Your KYC verification is under process"}
              </Text>
            </View>
          </View>
        </View>

        {/* Store Details Card */}
        <View className="bg-white rounded-xl shadow-sm p-5">
          <View className="flex-row items-center border-b border-gray-100 pb-2 mb-2">
            <MaterialIcons name="store" size={28} color="#3B82F6" />
            <View className="ml-3">
              <Text className="text-xl font-bold text-gray-800">
                Store Information
              </Text>
              <Text className="text-gray-500">Primary Business Details</Text>
            </View>
          </View>

          <View className="space-y-4">
            <DetailRow
              icon="store"
              label="Store Name"
              value={kycDetails.storeName}
              iconBg="bg-blue-50"
            />
            <DetailRow
              icon="location-on"
              label="Address"
              value={kycDetails.address}
              iconBg="bg-purple-50"
              iconColor="#9333EA"
            />
            <DetailRow
              icon="email"
              label="Email"
              value={kycDetails.email}
              iconBg="bg-indigo-50"
              iconColor="#6366F1"
            />
            <DetailRow
              icon="phone"
              label="Mobile"
              value={kycDetails.mobile}
              iconBg="bg-pink-50"
              iconColor="#EC4899"
            />
          </View>
        </View>

        {/* Document Details Card */}
        <View className="bg-white rounded-xl shadow-sm p-5">
          <View className="flex-row items-center border-b border-gray-100 pb-2 mb-2">
            <MaterialIcons name="description" size={28} color="#3B82F6" />
            <View className="ml-3">
              <Text className="text-xl font-bold text-gray-800">
                Document Details
              </Text>
              <Text className="text-gray-500">
                Business & Identity Documents
              </Text>
            </View>
          </View>

          <View className="space-y-4">
            <DetailRow
              icon="credit-card"
              label="PAN Number"
              value={kycDetails.panNumber}
              iconBg="bg-amber-50"
              iconColor="#F59E0B"
            />
            <DetailRow
              icon="business"
              label="GSTIN"
              value={kycDetails.gstin}
              iconBg="bg-emerald-50"
              iconColor="#10B981"
            />
            <DetailRow
              icon="restaurant"
              label="FSSAI Number"
              value={kycDetails.fssaiNumber}
              iconBg="bg-cyan-50"
              iconColor="#06B6D4"
            />
          </View>
        </View>

        {/* Document Images */}
        <View className="bg-white rounded-xl shadow-sm p-5">
          <View className="flex-row items-center border-b border-gray-100 pb-2 mb-2">
            <MaterialIcons name="image" size={28} color="#3B82F6" />
            <View className="ml-3">
              <Text className="text-xl font-bold text-gray-800">
                Uploaded Documents
              </Text>
              <Text className="text-gray-500">Verification Documents</Text>
            </View>
          </View>

          <View className="space-y-4">
            <DocumentImage label="PAN Card" imageUrl={kycDetails.panCard} />
            <DocumentImage
              label="Aadhaar Card"
              imageUrl={kycDetails.aadhaarCard}
            />
            <DocumentImage
              label="GSTIN Certificate"
              imageUrl={kycDetails.gstinCertificate}
            />
            <DocumentImage
              label="Address Proof"
              imageUrl={kycDetails.addressProof}
            />
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
}) => (
  <View className="flex-row items-center py-2">
    <View className={`${iconBg} p-3 rounded-full mr-4`}>
      <MaterialIcons name={icon} size={22} color={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-gray-500 text">{label}</Text>
      <Text className="text-gray-900 font-semibold text-base">{value}</Text>
    </View>
  </View>
);

const DocumentImage = ({ label, imageUrl }) => (
  <View className="space-y-2">
    <Text className="text-gray-700 font-medium">{label}</Text>

    <View className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
      <Image
        source={{
          uri: imageUrl,
        }}
        className="w-full h-56"
        resizeMode="contain"
      />
    </View>
  </View>
);

export default getKYCDetails;
