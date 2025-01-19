import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { validateBankDetails } from "../(docVerification)/verifiedData/validation";
import { useRouter } from "expo-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { pickImage } from "../../utils/imagePicker";
import uploadToCloudinary from "../../utils/uploadedImages";
import SuccessPopup from "../myComponent/successPopup";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const BankDetails = () => {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(false);
  const [checkboxError, setCheckboxError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    cancelledChequeImage: "",
  });

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bank-account/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setFormData(response.data.bankDetails);
        if (response.data.bankDetails.cancelledChequeImage) {
          setSelectedImage(response.data.bankDetails.cancelledChequeImage);
        }
        setChecked(true);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      if (error.response?.status === 401) {
        await logout();
      }
    }
  };

  const handleImagePick = async () => {
    try {
      const imageUri = await pickImage();
      if (imageUri) {
        setSelectedImage(imageUri);
        setErrors((prev) => ({ ...prev, cancelledChequeImage: null }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setErrors((prev) => ({
        ...prev,
        cancelledChequeImage: "Failed to pick image. Please try again.",
      }));
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async () => {
    const { isValid, errors: formErrors } = validateBankDetails(formData);
    setErrors(formErrors);

    if (!checked) {
      setCheckboxError("Please verify the details are correct");
      return;
    }
    setCheckboxError("");

    if (!selectedImage) {
      setErrors((prev) => ({
        ...prev,
        cancelledChequeImage: "Please upload a cancelled cheque image",
      }));
      return;
    }

    if (isValid) {
      setIsLoading(true);
      try {
        // Upload image to Cloudinary if it's a new image (not a URL)
        let cloudinaryUrl = selectedImage;
        if (!selectedImage.startsWith("http")) {
          cloudinaryUrl = await uploadToCloudinary(selectedImage);
        }

        const updatedFormData = {
          ...formData,
          cancelledChequeImage: cloudinaryUrl,
        };

        const response = await axios.put(
          `${API_URL}/api/bank-account/update`,
          updatedFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setShowSuccessPopup(true);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          await logout();
        } else {
          console.error("Error updating bank details:", error);
          setErrors({
            submit:
              error.response?.data?.error ||
              "Failed to update bank details. Please try again.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const inputFields = [
    {
      label: "Account Holder Name",
      key: "accountHolderName",
      placeholder: "Enter Account Holder Name",
    },
    {
      label: "Account Number",
      key: "accountNumber",
      placeholder: "Enter Account Number",
      keyboardType: "numeric",
    },
    {
      label: "IFSC Code",
      key: "ifscCode",
      placeholder: "Enter IFSC Code",
    },
    {
      label: "Bank Name",
      key: "bankName",
      placeholder: "Enter Bank Name",
    },
    {
      label: "Branch Name",
      key: "branchName",
      placeholder: "Enter Branch Name",
      multiline: true,
      numberOfLines: 4,
    },
  ];

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="bg-white"
        >
          <View className="px-4 py-3 border-b border-gray-200">
            <Text className="text-2xl font-semibold text-gray-800">
              Update Bank Details
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Please provide your bank account information
            </Text>
          </View>
          <ScrollView
            className="flex-1 px-6 bg-white"
            persistentScrollbar={true}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="py-3">
              {inputFields.map(
                ({
                  label,
                  key,
                  placeholder,
                  keyboardType,
                  multiline,
                  numberOfLines,
                }) => (
                  <View className="mb-3" key={key}>
                    <Label
                      nativeID={key}
                      className="text-base font-medium text-gray-700 mb-1"
                    >
                      {label}
                    </Label>
                    <Input
                      className="bg-gray-50 rounded-lg"
                      placeholder={placeholder}
                      value={formData[key]}
                      onChangeText={(value) => handleChange(key, value)}
                      keyboardType={keyboardType}
                      multiline={multiline}
                      numberOfLines={numberOfLines}
                      style={{
                        height: multiline ? 100 : 45,
                        textAlignVertical: multiline ? "top" : "center",
                        paddingHorizontal: 12,
                      }}
                    />
                    {errors[key] && (
                      <View className="flex-row items-center mt-1">
                        <FontAwesome
                          name="exclamation-circle"
                          size={14}
                          color="#EF4444"
                        />
                        <Text className="text-red-500 text-sm ml-1">
                          {errors[key]}
                        </Text>
                      </View>
                    )}
                  </View>
                )
              )}

              {/* Cancelled Cheque Image Upload */}
              <View className="mb-3">
                <Label className="text-base font-medium text-gray-700 mb-1">
                  Cancelled Cheque Image
                </Label>
                <TouchableOpacity
                  onPress={handleImagePick}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center bg-gray-50"
                >
                  {selectedImage ? (
                    <View className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        source={{
                          uri: selectedImage,
                        }}
                        className="w-full h-56"
                        resizeMode="contain"
                      />
                    </View>
                  ) : (
                    <View className="items-center">
                      <MaterialIcons
                        name="cloud-upload"
                        size={40}
                        color="#6B7280"
                      />
                      <Text className="text-gray-600 mt-2">
                        Upload Cancelled Cheque Image
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                {errors.cancelledChequeImage && (
                  <View className="flex-row items-center mt-1">
                    <FontAwesome
                      name="exclamation-circle"
                      size={14}
                      color="#EF4444"
                    />
                    <Text className="text-red-500 text-sm ml-1">
                      {errors.cancelledChequeImage}
                    </Text>
                  </View>
                )}
              </View>

              <View className="my-3">
                <View className="flex-row items-center">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={setChecked}
                    className={`${
                      checked ? "bg-blue-500" : "bg-white"
                    } border-2 border-blue-500`}
                  />
                  <Text className="ml-2 text-base text-gray-700 flex-1">
                    I verify that all updated bank details are correct
                  </Text>
                </View>
                {checkboxError && (
                  <Text className="text-red-500 text-sm mt-2">
                    {checkboxError}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading || !checked}
                className={`h-14 rounded-lg ${
                  !checked || isLoading ? "bg-blue-300" : "bg-blue-500"
                } justify-center my-3`}
              >
                <Text className="text-white font-semibold text-lg text-center">
                  {isLoading ? "Updating..." : "Update Details"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <SuccessPopup
        visible={showSuccessPopup}
        title="Update Successful!"
        message="Your bank details have been updated successfully"
        duration={2000}
        onClose={() => {
          setShowSuccessPopup(false);
          router.replace("./getBankDetails");
        }}
      />
    </>
  );
};

export default BankDetails;
