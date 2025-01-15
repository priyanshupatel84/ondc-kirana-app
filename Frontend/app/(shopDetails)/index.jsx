import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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

const StoreForm = () => {
  const { token, setShopId, logout } = useAuth();
  const { t } = useTranslation();
  const msg = messages(t);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    city: "",
    pinCode: "",
    state: "",
    country: "",
    supportEmail: "",
    supportMobile: "",
    logo: null,
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
    console.log("Store Details Submitted", formData);
    const formErrors = {};
    setErrors(formErrors);

    // Check for required fields (you can add more validation here)
    if (!formData.name) formErrors.name = "Shop name is required.";
    if (!formData.location) formErrors.location = "Shop location is required.";
    if (!formData.city) formErrors.city = "City is required.";
    if (!formData.pinCode) formErrors.pinCode = "PIN code is required.";
    if (!formData.state) formErrors.state = "State is required.";
    if (!formData.country) formErrors.country = "Country is required.";
    if (!formData.supportEmail)
      formErrors.supportEmail = "Support email is required.";
    if (!formData.supportMobile)
      formErrors.supportMobile = "Support mobile number is required.";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      console.log("Store Details Submitted", formData);
      try {
        const dataToSend = {
          name: formData.name,
          location: formData.location,
          city: formData.city,
          pinCode: formData.pinCode,
          state: formData.state,
          country: formData.country,
          supportEmail: formData.supportEmail,
          supportMobile: formData.supportMobile,
        };

        const response = await axios.post(
          `http://192.168.29.237:3000/api/shops/register`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          console.log("Shop registered successfully!", response.data);
          setShopId(response.data.shop._id);
          router.replace("./configureStore");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Token expired or invalid. Logging out.");
          await logout();
        } else {
          console.error("Error registering shop:", error);
          setErrors({ submit: "Failed to register shop. Please try again." });
        }
      }
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
        <Text className="text-[23px] mt-2 font-semibold text-center">
          {t("Store Details")}
        </Text>
        <View className="flex-1 p-3">
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
              <Text className="text-red-500">{errors.submit}</Text>
            )}
            <Button
              size="lg"
              onPress={handleSubmit}
              className="mt-4 mb-2 mx-auto w-full bg-blue-500"
            >
              <Text className="text-white font-semibold text-xl">
                {t("Submit")}
              </Text>
            </Button>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default StoreForm;
