import React, { useState } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import search icon

// Sample data for products with return info
const productsData = [
  {
    id: "1",
    name: "Apple",
    category: "Grocery",
    stock: 10,
    orders: 20,
    status: "Delivered",
    refundStatus: "None",
    user: { name: "John Doe", email: "johndoe@example.com", orderId: "ORD123" },
    returnReason: "Damaged Item",
    expectedArrivalDate: "2025-01-15",
  },
  {
    id: "2",
    name: "Shampoo",
    category: "Beauty",
    stock: 5,
    orders: 12,
    status: "Delivered",
    refundStatus: "None",
    user: {
      name: "Jane Smith",
      email: "janesmith@example.com",
      orderId: "ORD124",
    },
    returnReason: "Wrong Product",
    expectedArrivalDate: "2025-01-20",
  },
  {
    id: "3",
    name: "Football",
    category: "Sports",
    stock: 8,
    orders: 150,
    status: "Delivered",
    refundStatus: "None",
    user: {
      name: "Mike Johnson",
      email: "mikejohnson@example.com",
      orderId: "ORD125",
    },
    returnReason: "Not as described",
    expectedArrivalDate: "2025-01-18",
  },
  {
    id: "4",
    name: "Banana",
    category: "Grocery",
    stock: 0,
    orders: 5,
    status: "Delivered",
    refundStatus: "None",
    user: {
      name: "Alice Brown",
      email: "alicebrown@example.com",
      orderId: "ORD126",
    },
    returnReason: "Quality Issue",
    expectedArrivalDate: "2025-01-22",
  },
  {
    id: "5",
    name: "Lotion",
    category: "Beauty",
    stock: 2,
    orders: 8,
    status: "Delivered",
    refundStatus: "None",
    user: {
      name: "Chris Green",
      email: "chrisgreen@example.com",
      orderId: "ORD127",
    },
    returnReason: "Allergic Reaction",
    expectedArrivalDate: "2025-01-25",
  },
];

const RefundPage = () => {
  const [searchTerm, setSearchTerm] = useState(""); // For search functionality
  const [refundRequests, setRefundRequests] = useState(productsData); // List of refund requests

  // Function to filter products based on search
  const filteredProducts = refundRequests.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  });

  // Render refund request item
  const renderRefundItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#f0f8ff",
        borderRadius: 8,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
        <Text>{item.category}</Text>
        <Text>Status: {item.status}</Text>

        {/* User information */}
        <Text style={{ fontSize: 12, color: "gray" }}>
          <Text style={{ fontWeight: "bold" }}>User: </Text>
          {item.user.name} ({item.user.email})
        </Text>
        <Text style={{ fontSize: 12, color: "gray" }}>
          <Text style={{ fontWeight: "bold" }}>Order ID: </Text>
          {item.user.orderId}
        </Text>

        {/* Return information */}
        <Text style={{ fontSize: 12, color: "gray" }}>
          <Text style={{ fontWeight: "bold" }}>Return Reason: </Text>
          {item.returnReason}
        </Text>
        <Text style={{ fontSize: 12, color: "gray" }}>
          <Text style={{ fontWeight: "bold" }}>Expected Arrival: </Text>
          {item.expectedArrivalDate}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 15 }}>
      {/* Search bar */}
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <Ionicons
          name="search-outline"
          size={24}
          color="gray"
          style={{ marginTop: 12, marginRight: 10 }}
        />
        <TextInput
          style={{ borderWidth: 1, flex: 1, padding: 10, borderRadius: 8 }}
          placeholder="Search products"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* List of refund requests */}
      <FlatList
        data={filteredProducts}
        renderItem={renderRefundItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default RefundPage;
