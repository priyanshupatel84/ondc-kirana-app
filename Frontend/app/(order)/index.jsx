import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

// Sample order data (In a real application, this would come from your backend)
const ordersData = [
  {
    id: "ORD001",
    userName: "John Doe",
    productName: "Apple iPhone 13",
    quantity: 1,
    totalPrice: 999,
    orderStatus: "Pending", // Initially marked as "Pending"
  },
  {
    id: "ORD002",
    userName: "Jane Smith",
    productName: "Samsung Galaxy S21",
    quantity: 2,
    totalPrice: 1798,
    orderStatus: "Pending", // Initially marked as "Pending"
  },
  {
    id: "ORD003",
    userName: "Mark Johnson",
    productName: "Dell Laptop",
    quantity: 1,
    totalPrice: 899,
    orderStatus: "Shipped", // Initially marked as "Shipped"
  },
];

// Simulate an API call to check if the order is delivered
const simulateApiDeliveryStatus = (orderId) => {
  // Simulating a delay as if it's an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId: orderId,
        status: "Delivered", // The status comes as Delivered after the API confirms
      });
    }, 3000); // Simulating a 3-second delay
  });
};

const SellerOrderPage = () => {
  const [orders, setOrders] = useState(ordersData); // State for storing orders

  useEffect(() => {
    // Simulate an API call on component mount to check if orders are delivered
    const checkDeliveryStatus = async () => {
      for (let order of orders) {
        if (order.orderStatus === "Shipped") {
          const response = await simulateApiDeliveryStatus(order.id);
          handleOrderStatusChange(response.orderId, response.status);
        }
      }
    };

    checkDeliveryStatus(); // Call the function when the component mounts
  }, []); // Empty dependency array ensures it runs once after initial render

  const handleOrderStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, orderStatus: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  // Render each order item
  const renderOrderItem = ({ item }) => (
    <View
      key={item.id}
      className="border-b border-gray-300 p-4 mb-4 rounded-lg"
    >
      <Text className="font-semibold text-lg">Order ID: {item.id}</Text>
      <Text className="text-gray-600 text-sm">Customer: {item.userName}</Text>
      <Text className="text-gray-600 text-sm">Product: {item.productName}</Text>
      <Text className="text-gray-600 text-sm">Quantity: {item.quantity}</Text>
      <Text className="text-gray-700 mt-2">
        Total Price: ${item.totalPrice}
      </Text>
      <Text className="mt-2 text-gray-600">Status: {item.orderStatus}</Text>

      {/* Button to mark order as Shipped */}
      {item.orderStatus === "Pending" && (
        <TouchableOpacity
          className="bg-blue-500 py-2 px-4 rounded-lg mt-4"
          onPress={() => handleOrderStatusChange(item.id, "Shipped")}
        >
          <Text className="text-white text-center">Mark as Shipped</Text>
        </TouchableOpacity>
      )}

      {/* No notification displayed when the order is delivered */}
    </View>
  );

  return (
    <View className="flex-1 p-4 bg-white">
      {/* Render Orders */}
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default SellerOrderPage;
