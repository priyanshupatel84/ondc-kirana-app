import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CategoryBox = ({
  iconName,
  label,
  backgroundColor,
  iconColor,
  onPress,
  isGrocery,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className={`${backgroundColor} border border-blue-500`}
      onPress={onPress}
    >
      <View className={`flex-row ${isGrocery ? "p-6" : "p-4"} items-center`}>
        <View className={`${iconColor} rounded-full p-3`}>
          <MaterialIcons
            name={iconName}
            size={isGrocery ? 38 : 30}
            color="white"
          />
        </View>
        <View className="px-4">
          <Text
            className={`font-medium text-gray-800 ${
              isGrocery ? "text-2xl" : "text-lg"
            }`}
          >
            {label}
          </Text>
        </View>
        <MaterialIcons
          name="chevron-right"
          size={24}
          color="#3B82F6"
          className="absolute right-4"
        />
      </View>
    </TouchableOpacity>
  );
};

const Index = () => {
  const router = useRouter();

  const categories = [
    {
      iconName: "shopping-cart",
      label: "Grocery",
      iconColor: "bg-blue-500",
      backgroundColor: "bg-blue-50 rounded-xl mb-2",
      isGrocery: true,
    },
    {
      iconName: "face",
      label: "Beauty & Personal Care",
      iconColor: "bg-blue-500",
      backgroundColor: "bg-blue-50 rounded-xl mb-2",
    },
    {
      iconName: "kitchen",
      label: "Home & Kitchen",
      iconColor: "bg-blue-500",
      backgroundColor: "bg-blue-50 rounded-xl mb-2",
    },
    {
      iconName: "note",
      label: "Stationery",
      iconColor: "bg-blue-500",
      backgroundColor: "bg-blue-50 rounded-xl mb-2",
    },
    {
      iconName: "toys",
      label: "Toys & Games",
      iconColor: "bg-blue-500",
      backgroundColor: "bg-blue-50 rounded-xl mb-2",
    },
    {
      iconName: "agriculture",
      label: "Agriculture",
      iconColor: "bg-blue-400",
      backgroundColor: "bg-blue-50 rounded-xl mb-2",
      route: "component/commingSoon",
    },
    {
      iconName: "handyman",
      label: "Handcraft",
      iconColor: "bg-blue-400",
      backgroundColor: "bg-blue-50 rounded-xl mb-2",
      route: "component/commingSoon",
    },
  ];

  const handleCategoryPress = (category) => {
    if (category.route === "component/commingSoon") {
      router.push(category.route);
    } else {
      // Pass the category name as a parameter
      router.push({
        pathname: "product",
        params: { category: category.label },
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="pb-2 px-4">
        <View className="border-b border-gray-200 py-2">
          <Text className="text-xl font-semibold text-gray-800">
            Select category
          </Text>
          <Text className="text-gray-500">Select Product Category</Text>
        </View>

        <View className="py-3 px-2">
          {categories.map((category, index) => (
            <CategoryBox
              key={index}
              iconName={category.iconName}
              label={category.label}
              iconColor={category.iconColor}
              backgroundColor={category.backgroundColor}
              onPress={() => handleCategoryPress(category)}
              isGrocery={category.isGrocery}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Index;
