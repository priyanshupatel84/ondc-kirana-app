import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View className="bg-white h-full w-full px-4 py-2">
      <View className="flex-row justify-between items-center bg-gray-100 p-3 m-1 rounded-2xl">
        <View className="flex-row items-center">
          <MaterialIcons
            name="person"
            size={24}
            color="black"
            className="mr-2"
          />
          <Text className="text-xl font-bold">Profile</Text>
        </View>
        <TouchableOpacity
          className="bg-red-500 rounded-lg p-2 flex-row items-center"
          onPress={handleLogout}
        >
          <MaterialIcons
            name="logout"
            size={20}
            color="white"
            className="mr-1"
          />
          <Text className="text-white">Logout</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-around item-center gap-2 p-1 rounded">
        <View className="relative bg-gray-100 rounded-2xl p-1">
          <Image
            source={
              user?.photo_url
                ? { uri: user.photo_url }
                : require("../../assets/images/seller-photo.png")
            }
            className="w-36 h-36 rounded-full"
          />

          <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
            <MaterialIcons name="edit" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 flex-col justify-center gap-1">
          <View className="flex-1 flex-col justify-center bg-gray-100 rounded-2xl">
            <Text className="text-lg font-semibold text-center">Revenue:</Text>
            <Text className="text-3xl text-center">{user?.totalRevenue}</Text>
          </View>
          <View className="flex-1 flex-col justify-center bg-gray-100 rounded-2xl">
            <Text className="text-lg font-semibold text-center">Orders:</Text>
            <Text className="text-3xl text-center">{user?.totalOrders}</Text>
          </View>
        </View>
      </View>

      <View className="flex bg-gray-100 m-1 rounded-2xl p-2">
        <View className="mb-3 flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-semibold">Name:</Text>
            <Text className="text-lg">{user?.name}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="py-1 px-2 bg-blue-500 rounded-lg">
              <Text className="text-white">
                <MaterialIcons name="edit" size={16} color="white" />
                {" Edit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-3 flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-semibold">Mobile:</Text>
            <Text className="text-lg">{user?.mob_no}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="py-1 px-2 bg-blue-500 rounded-lg">
              <Text className="text-white">
                <MaterialIcons name="edit" size={16} color="white" />
                {" Edit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-2">
          <Text className="text-lg font-semibold">Email:</Text>
          <Text className="text-lg">{user?.email}</Text>
        </View>
        <TouchableOpacity className="bg-blue-500 p-2 rounded-lg mb-2 flex-row w-1/2">
          <MaterialIcons name="lock" size={20} color="white" className="" />
          <Text className="text-white pl-2">Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Additional items with verified icons and buttons */}

      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialIcons name="check-circle" size={20} color="green" />
          <Text className="text-lg ml-2">KYC Verified</Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity className="bg-gray-200 p-1 rounded mr-2">
            <Text>View</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-blue-500 p-1 rounded">
            <Text className="text-white">Update</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialIcons name="check-circle" size={20} color="green" />
          <Text className="text-lg ml-2">Bank Account Added</Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity className="bg-gray-200 p-1 rounded mr-2">
            <Text>View</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-blue-500 p-1 rounded">
            <Text className="text-white">Update</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialIcons name="check-circle" size={20} color="green" />
          <Text className="text-lg ml-2">Store Added</Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity className="bg-gray-200 p-1 rounded mr-2">
            <Text>View</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-blue-500 p-1 rounded">
            <Text className="text-white">Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;
