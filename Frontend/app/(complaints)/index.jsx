import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const complaintsData = [
  {
    id: "1",
    orderId: "ORD456",
    userName: "Priya Sharma",
    userEmail: "priya.sharma@example.com",
    complaintCategory: "Quality Issue",
    description:
      "The Basmati Rice package had some insects inside. Need immediate replacement.",
    status: "Pending",
    requestedAction: "Replacement",
    productName: "Premium Basmati Rice (5kg)",
    dateSubmitted: "2024-01-19",
  },
  {
    id: "2",
    orderId: "ORD457",
    userName: "Rajesh Kumar",
    userEmail: "rajesh.k@example.com",
    complaintCategory: "Wrong Quantity",
    description:
      "Ordered 2kg of Toor Dal but received only 1kg package. Please refund the difference.",
    status: "Pending",
    requestedAction: "Refund",
    productName: "Organic Toor Dal",
    dateSubmitted: "2024-01-20",
  },
  {
    id: "3",
    orderId: "ORD458",
    userName: "Aisha Patel",
    userEmail: "aisha.p@example.com",
    complaintCategory: "Expired Product",
    description:
      "The delivered Masala Mix packet is already expired. Manufacturing date shows last year.",
    status: "Refund Approved",
    requestedAction: "Refund",
    productName: "Garam Masala Mix",
    dateSubmitted: "2024-01-18",
  },
];

const ButtonIcon = ({ IconComponent, name, size = 14 }) => (
  <IconComponent
    name={name}
    size={size}
    color="#FFFFFF"
    style={{ marginRight: 4 }}
  />
);

const ActionButtons = ({ complaint, onDecline, onAction }) => {
  return (
    <View className="mt-2">
      <View className="flex-row justify-between space-x-1 gap-1">
        <Button
          variant="destructive"
          onPress={() => onDecline(complaint.id)}
          className="bg-red-500 px-3 py-1.5 h-6 flex-1"
        >
          <View className="flex-row items-center">
            <ButtonIcon IconComponent={MaterialIcons} name="cancel" />
            <Text className="text-white text-sm">Decline</Text>
          </View>
        </Button>

        <Button
          variant="default"
          onPress={() => onAction(complaint.id, complaint.requestedAction)}
          className="bg-blue-500 px-3 py-1.5 h-8 flex-1"
        >
          <View className="flex-row items-center">
            <ButtonIcon IconComponent={MaterialIcons} name="check-circle" />
            <Text className="text-white text-sm">Approve</Text>
          </View>
        </Button>
      </View>
    </View>
  );
};

const ProcessRefundButton = ({ onPayment, complaintId }) => (
  <View className="mt-2">
    <View className="mb-2">
      <Text className="text-sm font-medium text-gray-900">Payment Status</Text>
    </View>
    <Button
      variant="default"
      onPress={() => onPayment(complaintId)}
      className="bg-yellow-500 px-3 py-1.5 h-8 w-full"
    >
      <View className="flex-row items-center">
        <ButtonIcon IconComponent={MaterialCommunityIcons} name="cash-refund" />
        <Text className="text-white text-sm">Process Refund</Text>
      </View>
    </Button>
  </View>
);

const SellerComplaintPage = () => {
  const [complaints, setComplaints] = useState(complaintsData);

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: "pending",
          iconFamily: MaterialIcons,
          iconColor: "#CA8A04",
        };
      case "Refund Approved":
      case "Replacement Approved":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          icon: "refresh",
          iconFamily: MaterialIcons,
          iconColor: "#2563EB",
        };
      case "Payment Completed":
      case "Completed":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: "check-circle",
          iconFamily: MaterialIcons,
          iconColor: "#16A34A",
        };
      case "Declined":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: "cancel",
          iconFamily: MaterialIcons,
          iconColor: "#DC2626",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: "error-outline",
          iconFamily: MaterialIcons,
          iconColor: "#4B5563",
        };
    }
  };

  const handleAction = (complaintId, actionType) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === complaintId
          ? { ...complaint, status: `${actionType} Approved` }
          : complaint
      )
    );
  };

  const handleDecline = (complaintId) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === complaintId
          ? { ...complaint, status: "Declined" }
          : complaint
      )
    );
  };

  const handlePayment = (complaintId) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === complaintId
          ? { ...complaint, status: "Payment Completed" }
          : complaint
      )
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-3">
        <View className="bg-red-100 border border-red-200 p-2 mb-2 rounded-lg">
          <Text className="text-base text-red-800 text-center">
            🚨Not Connected to Backend, just for DEMO🚨
          </Text>
        </View>

        <View className="mb-2">
          <Text className="text-2xl font-bold text-gray-900">
            Complaint Management
          </Text>
          <Text className="text-base text-gray-600">
            Handle customer complaints and refund requests
          </Text>
        </View>

        <View className="space-y-4">
          {complaints.length === 0 ? (
            <Text className="text-center text-gray-500">
              No complaints submitted yet.
            </Text>
          ) : (
            complaints.map((complaint) => {
              const statusConfig = getStatusConfig(complaint.status);
              const StatusIcon = statusConfig.iconFamily;

              return (
                <Card
                  key={complaint.id}
                  className="border border-gray-200 bg-white"
                >
                  <CardHeader className="p-4 pb-2">
                    <View className="space-y-2">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-lg text-gray-900">
                          Order #{complaint.orderId}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          Submitted on {complaint.dateSubmitted}
                        </Text>
                      </View>
                      <View className="flex-row items-center space-x-2">
                        <View
                          className={`flex-row items-center px-3 py-1.5 rounded-full ${statusConfig.bg}`}
                        >
                          <StatusIcon
                            name={statusConfig.icon}
                            size={18}
                            color={statusConfig.iconColor}
                            style={{ marginRight: 6 }}
                          />
                          <Text
                            className={`text-base font-medium ${statusConfig.text}`}
                          >
                            {complaint.status}
                          </Text>
                        </View>
                        <View className="flex-row items-center px-3 py-1.5 rounded-full bg-purple-100">
                          <MaterialIcons
                            name={
                              complaint.requestedAction === "Replacement"
                                ? "swap-horiz"
                                : "payments"
                            }
                            size={18}
                            color="#7C3AED"
                            style={{ marginRight: 6 }}
                          />
                          <Text className="text-base font-medium text-purple-800">
                            {complaint.requestedAction}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </CardHeader>

                  <CardContent className="p-4 pt-2">
                    <View className="space-y-4">
                      <View className="space-y-1">
                        <Text className="text-base font-medium text-gray-900">
                          Customer Details
                        </Text>
                        <Text className="text-base text-gray-600">
                          {complaint.userName}
                        </Text>
                        <Text className="text text-gray-500">
                          {complaint.userEmail}
                        </Text>
                      </View>

                      <View className="space-y-2">
                        <Text className="text-base font-medium text-gray-900">
                          Complaint Details
                        </Text>
                        <View className="space-y-1">
                          <View className="flex-row">
                            <Text className="text font-medium text-gray-700 w-24">
                              Product:
                            </Text>
                            <Text className="text text-gray-600 flex-1">
                              {complaint.productName}
                            </Text>
                          </View>
                          <View className="flex-row">
                            <Text className="text font-medium text-gray-700 w-24">
                              Category:
                            </Text>
                            <Text className="text text-gray-600 flex-1">
                              {complaint.complaintCategory}
                            </Text>
                          </View>
                          <View className="flex-row">
                            <Text className="text font-medium text-gray-700 w-24">
                              Action:
                            </Text>
                            <Text className="text text-gray-600 flex-1">
                              {complaint.requestedAction}
                            </Text>
                          </View>
                          <View className="mt-2">
                            <Text className="text font-medium text-gray-700">
                              Description:
                            </Text>
                            <Text className="text text-gray-600 mt-1">
                              {complaint.description}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {complaint.status === "Pending" && (
                        <ActionButtons
                          complaint={complaint}
                          onDecline={handleDecline}
                          onAction={handleAction}
                        />
                      )}

                      {complaint.status === "Refund Approved" && (
                        <ProcessRefundButton
                          complaintId={complaint.id}
                          onPayment={handlePayment}
                        />
                      )}
                    </View>
                  </CardContent>
                </Card>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SellerComplaintPage;
