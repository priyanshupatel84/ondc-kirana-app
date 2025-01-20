import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { pickImage } from "../../utils/imagePicker";
import { useTranslation } from "react-i18next";
import messages from "./messages";
import LogoUpload from "./components/LogoUpload";
import BasicDetails from "./components/BasicDetails";
import { Progress } from "~/components/ui/progress";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uploadToCloudinary from "../../utils/uploadedImages";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const StoreForm = () => {
  const { token, logout, setUser, user, kyc } = useAuth();
  const { t } = useTranslation();
  const msg = messages(t);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: kyc?.storeName || "",
    logo: "",
    location: kyc?.address || "",
    city: "",
    pinCode: "",
    state: "",
    country: "India",
    supportEmail: user?.email || "",
    supportMobile: user?.mob_no || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleLogoPress = async () => {
    const uri = await pickImage();
    if (uri) {
      handleChange("logo", uri);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});

      const formErrors = {};
      if (!formData.name) formErrors.name = "Shop name is required.";
      if (!formData.location)
        formErrors.location = "Shop location is required.";
      if (!formData.city) formErrors.city = "City is required.";
      if (!formData.pinCode) formErrors.pinCode = "PIN code is required.";
      if (!formData.state) formErrors.state = "State is required.";
      if (!formData.country) formErrors.country = "Country is required.";
      if (!formData.supportEmail)
        formErrors.supportEmail = "Support email is required.";
      if (!formData.supportMobile)
        formErrors.supportMobile = "Support mobile number is required.";

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        setIsSubmitting(false);
        return;
      }

      const submitData = { ...formData };

      if (formData.logo && formData.logo.startsWith("file://")) {
        try {
          const logoUrl = await uploadToCloudinary(formData.logo);
          submitData.logo = logoUrl;
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          setErrors({ submit: "Failed to upload logo. Please try again." });
          setIsSubmitting(false);
          return;
        }
      }

      const response = await axios.post(
        `${API_URL}/api/shops/register`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const updatedUser = response.data.user;
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        router.replace("./configureStore");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        await logout();
      } else {
        console.error("Error registering shop:", error);
        setErrors({
          submit: "Failed to register shop. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
        <Progress value={61} className="web:w-[60%]" />
        <View className="px-4 py-3 border-b border-gray-200">
          <Text className="text-2xl font-semibold text-gray-800">
            {t("Store Details")}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {t("Please provide your shop information")}
          </Text>
        </View>
        <View className="flex-1 p-3 py-2">
          <ScrollView className="flex-1 px-3" persistentScrollbar={true}>
            <LogoUpload
              logo={formData.logo}
              onLogoPress={handleLogoPress}
              t={t}
            />

            <BasicDetails
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              msg={msg}
            />

            {errors.submit && (
              <Text className="text-red-500 text-center my-2">
                {errors.submit}
              </Text>
            )}

            <Button
              size="lg"
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`mt-4 mb-2 mx-auto w-full ${
                isSubmitting ? "bg-blue-300" : "bg-blue-500"
              }`}
            >
              {isSubmitting ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-semibold text-xl ml-2">
                    {formData.logo?.startsWith("file://")
                      ? "Uploading..."
                      : "Submitting..."}
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-xl">
                  {t("Submit")}
                </Text>
              )}
            </Button>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default StoreForm;
