import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Importing router for navigation

const CategoryBox = ({
  iconName,
  label,
  backgroundColor,
  iconColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      className={`w-[46%] h-28 flex-row items-center rounded-xl ${backgroundColor} p-2 border border-gray-300`}
      onPress={onPress} // Call onPress when the box is pressed
    >
      <View
        className={`flex items-center justify-center p-2 ${iconColor} rounded-xl`}
      >
        <MaterialIcons name={iconName} size={36} color={"white"} />
      </View>
      <View className="flex-1 p-2">
        <Text className="text-center text-xl font-bold">{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Index = () => {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 p-1 bg-white">
      <View className="flex flex-row flex-wrap justify-center gap-2 p-1">
        <View className="flex-row items-center justify-center py-2 px-3 bg-gray-900 rounded-2xl">
          <MaterialIcons
            name="category"
            size={24}
            color="white"
            className="mr-2"
          />
          <Text className="text-md font-bold text-white">
            SELECT PRODUCT CATEGORY
          </Text>
        </View>

        <CategoryBox
          iconName="shopping-cart"
          label="Grocery"
          iconColor="bg-blue-500"
          backgroundColor="bg-blue-100"
          onPress={() => router.push("/grocery")}
        />
        <CategoryBox
          iconName="face"
          label="Beauty & Personal Care"
          iconColor="bg-blue-500"
          backgroundColor="bg-blue-100"
          onPress={() => router.push("/grocery")}
        />
        <CategoryBox
          iconName="kitchen"
          label="Home & Kitchen"
          iconColor="bg-green-500"
          backgroundColor="bg-green-100"
          onPress={() => router.push("/grocery")}
        />
        <CategoryBox
          iconName="fastfood"
          label="Food & Beverages (F&B)"
          iconColor="bg-green-500"
          backgroundColor="bg-green-100"
          onPress={() => router.push("/grocery")}
        />
        <CategoryBox
          iconName="style"
          label="Fashion"
          iconColor="bg-blue-500"
          backgroundColor="bg-blue-100"
          onPress={() => router.push("/grocery")}
        />
        <CategoryBox
          iconName="handyman"
          label="Handcraft"
          iconColor="bg-blue-500"
          backgroundColor="bg-blue-100"
          onPress={() => router.push("/grocery")}
        />
        <CategoryBox
          iconName="agriculture"
          label="Agriculture Products"
          iconColor="bg-green-500"
          backgroundColor="bg-green-100"
          onPress={() => router.push("/grocery")}
        />
        <CategoryBox
          iconName="cake"
          label="Bakeries"
          iconColor="bg-green-500"
          backgroundColor="bg-green-100"
          onPress={() => router.push("/grocery")}
        />
        <CategoryBox
          iconName="note"
          label="Stationery"
          iconColor="bg-blue-500"
          backgroundColor="bg-blue-100"
          onPress={() => router.push("/grocery")}
        />
        <CategoryBox
          iconName="toys"
          label="Toys & Games"
          iconColor="bg-blue-500"
          backgroundColor="bg-blue-100"
          onPress={() => router.push("/grocery")}
        />
        <CategoryBox
          iconName="fitness-center"
          label="Sports & Fitness"
          iconColor="bg-green-500"
          backgroundColor="bg-green-100"
          onPress={() => router.push("/grocery")}
        />
        <CategoryBox
          iconName="shoes"
          label="Footwear"
          iconColor="bg-green-500"
          backgroundColor="bg-green-100"
          onPress={() => router.push("/grocery")}
        />
      </View>
    </ScrollView>
  );
};

export default Index;
