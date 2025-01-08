import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";

// Sample complaint data with requestedAction and productName
const complaintsData = [
  {
    id: "1",
    orderId: "ORD123",
    userName: "John Doe",
    userEmail: "johndoe@example.com",
    complaintCategory: "Damaged Item",
    description: "The product arrived damaged, screen was cracked.",
    status: "Pending",
    requestedAction: "Refund",
    productName: "Smartphone", // Product name added
  },
  {
    id: "2",
    orderId: "ORD124",
    userName: "Jane Smith",
    userEmail: "janesmith@example.com",
    complaintCategory: "Wrong Product",
    description:
      "I received a wrong item, I ordered a red shirt but got a blue one.",
    status: "Pending",
    requestedAction: "Replacement",
    productName: "Red Shirt", // Product name added
  },
];

const SellerComplaintPage = () => {
  const [complaints, setComplaints] = useState(complaintsData);

  const handleAction = (complaintId, actionType) => {
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === complaintId
        ? { ...complaint, status: `${actionType} Approved` }
        : complaint
    );
    setComplaints(updatedComplaints);
    Alert.alert(
      "Complaint Updated",
      `The complaint has been marked as ${actionType}`
    );
  };

  const handleDecline = (complaintId) => {
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === complaintId
        ? { ...complaint, status: "Declined" }
        : complaint
    );
    setComplaints(updatedComplaints);
    Alert.alert("Complaint Declined", "The complaint has been declined.");
  };

  const handlePayment = (complaintId) => {
    Alert.alert(
      "Payment Processed",
      "Payment has been successfully processed."
    );
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === complaintId
        ? { ...complaint, status: "Payment Completed" }
        : complaint
    );
    setComplaints(updatedComplaints);
  };

  const renderComplaintItem = (complaint) => (
    <View
      key={complaint.id}
      className="border-b border-gray-300 p-4 mb-4 rounded-lg bg-gray-100"
    >
      <Text className="font-semibold text-lg">
        Order ID: {complaint.orderId}
      </Text>
      <Text className="text-gray-600 text-sm">
        Product: {complaint.productName}
      </Text>
      <Text className="text-gray-600 text-sm">
        Category: {complaint.complaintCategory}
      </Text>
      <Text className="text-gray-700 mt-2">{complaint.description}</Text>
      <Text className="mt-2 text-gray-600">Status: {complaint.status}</Text>

      {complaint.status === "Pending" && (
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="bg-red-500 py-2 px-4 rounded-lg"
            onPress={() => handleDecline(complaint.id)}
          >
            <Text className="text-white text-center">Decline Request</Text>
          </TouchableOpacity>

          {complaint.requestedAction === "Refund" ? (
            <TouchableOpacity
              className="bg-green-500 py-2 px-4 rounded-lg"
              onPress={() => handleAction(complaint.id, "Refund")}
            >
              <Text className="text-white text-center">Approve Refund</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-blue-500 py-2 px-4 rounded-lg"
              onPress={() => handleAction(complaint.id, "Replacement")}
            >
              <Text className="text-white text-center">
                Approve Replacement
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {complaint.status === "Refund Approved" && (
        <TouchableOpacity
          className="bg-yellow-500 py-2 px-4 rounded-lg mt-4"
          onPress={() => handlePayment(complaint.id)}
        >
          <Text className="text-white text-center">Proceed to Payment</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="space-y-4">
        {complaints.length === 0 ? (
          <Text className="text-center text-gray-500">
            No complaints submitted yet.
          </Text>
        ) : (
          complaints.map(renderComplaintItem)
        )}
      </View>
    </View>
  );
};

export default SellerComplaintPage;
