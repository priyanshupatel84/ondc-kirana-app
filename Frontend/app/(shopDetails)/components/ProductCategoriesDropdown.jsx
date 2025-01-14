import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  TextInput,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Label } from "~/components/ui/label";

const ProductCategoriesDropdown = ({
  categories,
  selectedCategories,
  onSelectionChange,
  placeholder = "Select Categories",
  maxHeight = 300,
  searchable = true,
  multiple = true,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownAnimation] = useState(new Animated.Value(0));

  const toggleDropdown = useCallback(() => {
    const toValue = isDropdownOpen ? 0 : 1;
    Animated.spring(dropdownAnimation, {
      toValue,
      useNativeDriver: false,
      friction: 8,
    }).start();
    setDropdownOpen(!isDropdownOpen);
  }, [isDropdownOpen]);

  const handleCategorySelect = useCallback(
    (category) => {
      if (multiple) {
        const isSelected = selectedCategories.includes(category);
        const updatedCategories = isSelected
          ? selectedCategories.filter((item) => item !== category)
          : [...selectedCategories, category];
        onSelectionChange(updatedCategories);
      } else {
        onSelectionChange([category]);
        toggleDropdown();
      }
    },
    [selectedCategories, multiple, onSelectionChange]
  );

  const clearSelection = useCallback(() => {
    onSelectionChange([]);
  }, [onSelectionChange]);

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dropdownHeight = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxHeight],
  });

  const renderSelectedItems = () => {
    if (selectedCategories.length === 0) {
      return <Text className="text-gray-500 text-lg">{placeholder}</Text>;
    }

    return (
      <Text className="text-lg text-gray-800 font-medium" numberOfLines={1}>
        {selectedCategories.join(", ")}
      </Text>
    );
  };

  return (
    <View className="mb-4">
      <Label className="text-lg font-semibold mb-2">Product Categories</Label>
      <TouchableOpacity
        onPress={toggleDropdown}
        activeOpacity={0.7}
        className="border border-gray-400 bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <View className="py-4 pl-3 pr-1 flex-row justify-between items-center">
          <View className="flex-1 ">
            <Text>{renderSelectedItems()}</Text>
          </View>
          <View className="flex-row ">
            {selectedCategories.length > 0 && (
              <TouchableOpacity
                onPress={clearSelection}
                className=" p-1 rounded-full bg-gray-100"
              >
                <MaterialIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            )}
            <MaterialIcons
              className="ml-2"
              name={
                isDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"
              }
              size={24}
              color="#666"
            />
          </View>
        </View>
      </TouchableOpacity>

      <Animated.View
        style={{ maxHeight: dropdownHeight }}
        className="mt-1 overflow-hidden"
      >
        <View className="border border-gray-200 rounded-xl bg-white shadow-lg">
          {searchable && (
            <View className="px-4 py-2 border-b border-gray-100">
              <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2">
                <MaterialIcons name="search" size={20} color="#666" />
                <TextInput
                  className="flex-1 ml-2 text-base"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#666"
                />
              </View>
            </View>
          )}

          <ScrollView nestedScrollEnabled bounces={false} className="max-h-72">
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleCategorySelect(item)}
                  className={`px-4 py-3 flex-row justify-between items-center border-b border-gray-50 active:bg-gray-50
                    ${selectedCategories.includes(item) ? "bg-blue-50" : ""}`}
                >
                  <Text
                    className={`text-base ${
                      selectedCategories.includes(item)
                        ? "text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {item}
                  </Text>
                  {selectedCategories.includes(item) && (
                    <MaterialIcons name="check" size={20} color="#2563eb" />
                  )}
                </Pressable>
              )}
              ListEmptyComponent={
                <View className="py-8 items-center">
                  <Text className="text-gray-500">No categories found</Text>
                </View>
              }
            />
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
};

export default ProductCategoriesDropdown;
