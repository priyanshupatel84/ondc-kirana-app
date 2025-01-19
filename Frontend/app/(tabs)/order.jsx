// import React, { useState, useEffect } from "react";
// import { View, ScrollView, ActivityIndicator } from "react-native";
// import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
// import { Text } from "~/components/ui/text";
// import { Button } from "~/components/ui/button";

// const ordersData = [
//   {
//     id: "ORD001",
//     userName: "Priya Sharma",
//     productName: "Basmati Rice (5kg)",
//     quantity: 2,
//     totalPrice: 1200,
//     orderStatus: "Pending",
//     orderDate: "2024-01-19",
//   },
//   {
//     id: "ORD002",
//     userName: "Rajesh Patel",
//     productName: "Masala Chai Tea (500g)",
//     quantity: 3,
//     totalPrice: 450,
//     orderStatus: "Pending",
//     orderDate: "2024-01-19",
//   },
//   {
//     id: "ORD003",
//     userName: "Anjali Gupta",
//     productName: "Chickpea Flour (1kg)",
//     quantity: 1,
//     totalPrice: 120,
//     orderStatus: "Shipped",
//     orderDate: "2024-01-18",
//   },
//   {
//     id: "ORD004",
//     userName: "Vikram Singh",
//     productName: "Ghee (500ml)",
//     quantity: 2,
//     totalPrice: 600,
//     orderStatus: "Delivered",
//     orderDate: "2024-01-16",
//   },
//   {
//     id: "ORD005",
//     userName: "Deepa Reddy",
//     productName: "Turmeric Powder (200g)",
//     quantity: 1,
//     totalPrice: 80,
//     orderStatus: "Pending",
//     orderDate: "2024-01-20",
//   },
// ];
// const SellerOrderPage = () => {
//   const [orders, setOrders] = useState(ordersData);
//   const [loading, setLoading] = useState({});

//   useEffect(() => {
//     const checkDeliveryStatus = async () => {
//       for (let order of orders) {
//         if (order.orderStatus === "Shipped") {
//           try {
//             const response = await simulateApiDeliveryStatus(order.id);
//             handleOrderStatusChange(response.orderId, response.status);
//           } catch (err) {
//             console.error("Failed to update delivery status");
//           }
//         }
//       }
//     };
//     checkDeliveryStatus();
//   }, []);

//   const simulateApiDeliveryStatus = (orderId) =>
//     new Promise((resolve) => {
//       setTimeout(() => resolve({ orderId, status: "Delivered" }), 3000);
//     });

//   const handleOrderStatusChange = async (orderId, newStatus) => {
//     setLoading((prev) => ({ ...prev, [orderId]: true }));
//     try {
//       if (newStatus === "Shipped")
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//       const updatedOrders = orders.map((order) =>
//         order.id === orderId ? { ...order, orderStatus: newStatus } : order
//       );
//       setOrders(updatedOrders);
//     } catch (err) {
//       console.error("Failed to update order status");
//     } finally {
//       setLoading((prev) => ({ ...prev, [orderId]: false }));
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return {
//           bg: "bg-yellow-100",
//           text: "text-yellow-800",
//           icon: "#CA8A04",
//         };
//       case "Shipped":
//         return {
//           bg: "bg-blue-100",
//           text: "text-blue-800",
//           icon: "#2563EB",
//         };
//       case "Delivered":
//         return {
//           bg: "bg-green-100",
//           text: "text-green-800",
//           icon: "#16A34A",
//         };
//       default:
//         return {
//           bg: "bg-gray-100",
//           text: "text-gray-800",
//           icon: "#4B5563",
//         };
//     }
//   };

//   return (
//     <ScrollView className="flex-1 bg-white">
//       <View className="p-2">
//         <View className="mb-4">
//           <Text className="text-2xl font-bold text-gray-900">
//             Order Management
//           </Text>
//           <Text className="text-base text-gray-600">
//             Manage and track your customer orders
//           </Text>
//         </View>
//         <View className="space-y-3">
//           {orders.map((order) => {
//             const statusColors = getStatusColor(order.orderStatus);
//             return (
//               <Card key={order.id} className="border border-gray-200 bg-white">
//                 <CardHeader className="p-4 pb-2 flex-row justify-between items-center">
//                   <View className="flex-row items-center space-x-2">
//                     <Text className="text-lg text-gray-900">
//                       Order #{order.id}
//                     </Text>
//                     <View
//                       className={`flex-row items-center px-2 py-1 rounded-full ${statusColors.bg}`}
//                     >
//                       {order.orderStatus === "Pending" && (
//                         <MaterialIcons
//                           name="pending"
//                           size={16}
//                           color={statusColors.icon}
//                         />
//                       )}
//                       {order.orderStatus === "Shipped" && (
//                         <MaterialCommunityIcons
//                           name="truck-delivery"
//                           size={16}
//                           color={statusColors.icon}
//                         />
//                       )}
//                       {order.orderStatus === "Delivered" && (
//                         <MaterialIcons
//                           name="check-circle"
//                           size={16}
//                           color={statusColors.icon}
//                         />
//                       )}
//                       <Text
//                         className={`ml-2 text-sm font-medium ${statusColors.text}`}
//                       >
//                         {order.orderStatus}
//                       </Text>
//                     </View>
//                   </View>
//                   <Text className="text-sm text-gray-500">
//                     {order.orderDate}
//                   </Text>
//                 </CardHeader>
//                 <CardContent className="p-4 pt-2">
//                   <View className="space-y-2">
//                     <View>
//                       <Text className="text-base font-medium text-gray-900">
//                         Customer
//                       </Text>
//                       <Text className="text-base text-gray-600">
//                         {order.userName}
//                       </Text>
//                     </View>
//                     <View>
//                       <Text className="text-base font-medium text-gray-900">
//                         Order Details
//                       </Text>
//                       <Text className="text-base text-gray-600">
//                         {order.productName} x {order.quantity}
//                       </Text>
//                       <Text className="text-base font-semibold text-gray-900">
//                         Total: ₹{order.totalPrice.toLocaleString()}
//                       </Text>
//                     </View>
//                     {order.orderStatus === "Pending" && (
//                       <Button
//                         variant="default"
//                         className="mt-2 bg-blue-600"
//                         disabled={loading[order.id]}
//                         onPress={() =>
//                           handleOrderStatusChange(order.id, "Shipped")
//                         }
//                       >
//                         <View className="flex-row items-center justify-center">
//                           {loading[order.id] ? (
//                             <>
//                               <ActivityIndicator
//                                 size="small"
//                                 color="#FFFFFF"
//                                 style={{ marginRight: 8 }}
//                               />
//                               <Text className="text-base text-white">
//                                 Processing...
//                               </Text>
//                             </>
//                           ) : (
//                             <>
//                               <MaterialCommunityIcons
//                                 name="truck-delivery"
//                                 size={16}
//                                 color="#FFFFFF"
//                                 style={{ marginRight: 8 }}
//                               />
//                               <Text className="text-base text-white">
//                                 Mark as Shipped
//                               </Text>
//                             </>
//                           )}
//                         </View>
//                       </Button>
//                     )}
//                   </View>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default SellerOrderPage;

import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

const ordersData = [
  {
    id: "ORD001",
    userName: "Priya Sharma",
    productName: "Basmati Rice (5kg)",
    quantity: 2,
    totalPrice: 1200,
    orderStatus: "Pending",
    orderDate: "2024-01-19",
  },
  {
    id: "ORD002",
    userName: "Rajesh Patel",
    productName: "Masala Chai Tea (500g)",
    quantity: 3,
    totalPrice: 450,
    orderStatus: "Pending",
    orderDate: "2024-01-19",
  },
  {
    id: "ORD003",
    userName: "Anjali Gupta",
    productName: "Chickpea Flour (1kg)",
    quantity: 1,
    totalPrice: 120,
    orderStatus: "Shipped",
    orderDate: "2024-01-18",
  },
  {
    id: "ORD004",
    userName: "Vikram Singh",
    productName: "Ghee (500ml)",
    quantity: 2,
    totalPrice: 600,
    orderStatus: "Delivered",
    orderDate: "2024-01-16",
  },
  {
    id: "ORD005",
    userName: "Deepa Reddy",
    productName: "Turmeric Powder (200g)",
    quantity: 1,
    totalPrice: 80,
    orderStatus: "Pending",
    orderDate: "2024-01-20",
  },
];

const SellerOrderPage = () => {
  const [orders, setOrders] = useState(ordersData);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    const checkDeliveryStatus = async () => {
      for (let order of orders) {
        if (order.orderStatus === "Shipped") {
          try {
            const response = await simulateApiDeliveryStatus(order.id);
            handleOrderStatusChange(response.orderId, response.status);
          } catch (err) {
            console.error("Failed to update delivery status");
          }
        }
      }
    };
    checkDeliveryStatus();
  }, []);

  const simulateApiDeliveryStatus = (orderId) =>
    new Promise((resolve) => {
      setTimeout(() => resolve({ orderId, status: "Delivered" }), 3000);
    });

  const handleOrderStatusChange = async (orderId, newStatus) => {
    setLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      if (newStatus === "Shipped")
        await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Failed to update order status");
    } finally {
      setLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: "#CA8A04",
        };
      case "Shipped":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          icon: "#2563EB",
        };
      case "Delivered":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: "#16A34A",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: "#4B5563",
        };
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-2">
        <View className="bg-red-100 border border-red-200 p-3 mb-4 rounded-lg">
          <Text className="text-base text-red-800 text-center">
            🚨Not Connected to Backend, just for DEMO 🚨
          </Text>
        </View>
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-900">
            Order Management
          </Text>
          <Text className="text-base text-gray-600">
            Manage and track your customer orders
          </Text>
        </View>
        <View className="space-y-3">
          {orders.map((order) => {
            const statusColors = getStatusColor(order.orderStatus);
            return (
              <Card key={order.id} className="border border-gray-200 bg-white">
                <CardHeader className="p-4 pb-2 flex-row justify-between items-center">
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-lg text-gray-900">
                      Order #{order.id}
                    </Text>
                    <View
                      className={`flex-row items-center px-2 py-1 rounded-full ${statusColors.bg}`}
                    >
                      {order.orderStatus === "Pending" && (
                        <MaterialIcons
                          name="pending"
                          size={16}
                          color={statusColors.icon}
                        />
                      )}
                      {order.orderStatus === "Shipped" && (
                        <MaterialCommunityIcons
                          name="truck-delivery"
                          size={16}
                          color={statusColors.icon}
                        />
                      )}
                      {order.orderStatus === "Delivered" && (
                        <MaterialIcons
                          name="check-circle"
                          size={16}
                          color={statusColors.icon}
                        />
                      )}
                      <Text
                        className={`ml-2 text-sm font-medium ${statusColors.text}`}
                      >
                        {order.orderStatus}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm text-gray-500">
                    {order.orderDate}
                  </Text>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <View className="space-y-2">
                    <View>
                      <Text className="text-base font-medium text-gray-900">
                        Customer
                      </Text>
                      <Text className="text-base text-gray-600">
                        {order.userName}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-base font-medium text-gray-900">
                        Order Details
                      </Text>
                      <Text className="text-base text-gray-600">
                        {order.productName} x {order.quantity}
                      </Text>
                      <Text className="text-base font-semibold text-gray-900">
                        Total: ₹{order.totalPrice.toLocaleString()}
                      </Text>
                    </View>
                    {order.orderStatus === "Pending" && (
                      <Button
                        variant="default"
                        className="mt-2 bg-blue-600"
                        disabled={loading[order.id]}
                        onPress={() =>
                          handleOrderStatusChange(order.id, "Shipped")
                        }
                      >
                        <View className="flex-row items-center justify-center">
                          {loading[order.id] ? (
                            <>
                              <ActivityIndicator
                                size="small"
                                color="#FFFFFF"
                                style={{ marginRight: 8 }}
                              />
                              <Text className="text-base text-white">
                                Processing...
                              </Text>
                            </>
                          ) : (
                            <>
                              <MaterialCommunityIcons
                                name="truck-delivery"
                                size={16}
                                color="#FFFFFF"
                                style={{ marginRight: 8 }}
                              />
                              <Text className="text-base text-white">
                                Mark as Shipped
                              </Text>
                            </>
                          )}
                        </View>
                      </Button>
                    )}
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

export default SellerOrderPage;
