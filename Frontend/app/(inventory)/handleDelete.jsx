import { Alert } from "react-native";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

export const handleDelete = async (productId, token, fetchProducts) => {
  try {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.delete(
                `${API_URL}/api/product/${productId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.data.success) {
                Alert.alert("Success", "Product deleted successfully");
                fetchProducts();
              }
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to delete product"
              );
            }
          },
        },
      ]
    );
  } catch (error) {
    console.error("Error in handleDelete:", error);
    Alert.alert("Error", "Failed to process delete request");
  }
};
