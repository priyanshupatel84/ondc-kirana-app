import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import ShopStatus from "./components/ShopStatus";
import ShopHours from "./components/ShopHours";
import ProductCategoriesDropdown from "./components/ProductCategoriesDropdown";
import DefaultSettings from "./components/DefaultSettings";
import LocationAvailability from "./components/LocationAvailability";
import SubmitButton from "./components/SubmitButton";
import messages from "./messages";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import ShopUpdateSkeleton from "./components/shopUpdateSkeleton";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const UpdateShop = () => {
  const { t } = useTranslation();
  const msg = messages(t);
  const { token, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    isLiveShop: false,
    openingTime: "",
    closingTime: "",
    productCategories: [],
    locationAvailability: "PAN India",
    city: "",
    customRadius: "",
    defaultCancellableSetting: false,
    defaultReturnableSetting: false,
    name: "",
    supportEmail: "",
    supportMobile: "",
    location: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uiError, setUiError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        console.log("Fetching shop details...");
        const response = await axios.get(`${API_URL}/api/shops/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Shop details:", JSON.stringify(response.data));
        const shopData = response.data.shop;
        setFormData({
          isLiveShop: shopData.isLiveShop ?? false,
          openingTime: shopData.openingTime ?? "",
          closingTime: shopData.closingTime ?? "",
          productCategories: shopData.productCategories ?? [],
          locationAvailability: shopData.locationAvailability ?? "PAN India",
          city: shopData.city ?? "",
          customRadius: shopData.customRadius ?? "",
          defaultCancellableSetting:
            shopData.defaultCancellableSetting ?? false,
          defaultReturnableSetting: shopData.defaultReturnableSetting ?? false,
          name: shopData.name ?? "",
          supportEmail: shopData.supportEmail ?? "",
          supportMobile: shopData.supportMobile ?? "",
          location: shopData.location ?? "",
          state: shopData.state ?? "",
          country: shopData.country ?? "",
          pinCode: shopData.pinCode ?? "",
        });
      } catch (error) {
        console.error("Error fetching shop details:", error);
        if (error.response?.status === 401) {
          await logout();
        } else {
          setUiError(msg.alerts.fetchFailed || "Failed to load shop details");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopDetails();
  }, [token, logout, msg.alerts.fetchFailed]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.openingTime) {
      validationErrors.openingTime = msg.validationMessages.required;
    }
    if (!formData.closingTime) {
      validationErrors.closingTime = msg.validationMessages.required;
    }
    if (!formData.productCategories.length) {
      validationErrors.productCategories = msg.validationMessages.required;
    }
    if (formData.locationAvailability === "City" && !formData.city) {
      validationErrors.city = msg.validationMessages.cityRequired;
    }
    if (formData.locationAvailability === "Custom" && !formData.customRadius) {
      validationErrors.customRadius =
        msg.validationMessages.deliveryRadiusRequired;
    }
    return validationErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setUiError(msg.alerts.checkFields);
      return;
    }

    setIsSubmitting(true);
    setUiError("");

    try {
      const submissionData = {
        isLiveShop: formData.isLiveShop,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        productCategories: formData.productCategories,
        locationAvailability: formData.locationAvailability,
        city: formData.city,
        customRadius: formData.customRadius,
        defaultCancellableSetting: formData.defaultCancellableSetting,
        defaultReturnableSetting: formData.defaultReturnableSetting,
        name: formData.name,
        supportEmail: formData.supportEmail,
        supportMobile: formData.supportMobile,
        location: formData.location,
        state: formData.state,
        country: formData.country,
        pinCode: formData.pinCode,
      };

      console.log("Submitting data:", submissionData);

      const response = await axios.patch(
        `${API_URL}/api/shops/update`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update response:", response.data);

      const refreshResponse = await axios.get(`${API_URL}/api/shops/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedShopData = refreshResponse.data.shop;
      setFormData({
        isLiveShop: updatedShopData.isLiveShop ?? false,
        openingTime: updatedShopData.openingTime ?? "",
        closingTime: updatedShopData.closingTime ?? "",
        productCategories: updatedShopData.productCategories ?? [],
        locationAvailability:
          updatedShopData.locationAvailability ?? "PAN India",
        city: updatedShopData.city ?? "",
        customRadius: updatedShopData.customRadius ?? "",
        defaultCancellableSetting:
          updatedShopData.defaultCancellableSetting ?? false,
        defaultReturnableSetting:
          updatedShopData.defaultReturnableSetting ?? false,
        name: updatedShopData.name ?? "",
        supportEmail: updatedShopData.supportEmail ?? "",
        supportMobile: updatedShopData.supportMobile ?? "",
        location: updatedShopData.location ?? "",
        state: updatedShopData.state ?? "",
        country: updatedShopData.country ?? "",
        pinCode: updatedShopData.pinCode ?? "",
      });
    } catch (error) {
      console.error("Error updating shop:", error);
      if (error.response?.status === 401) {
        await logout();
      } else {
        setUiError(error.response?.data?.message || msg.alerts.saveFailed);
      }
    } finally {
      setIsSubmitting(false);
      router.replace("/(tabs)/home");
    }
  };

  if (isLoading) {
    return <ShopUpdateSkeleton />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-semibold text-gray-800">
          {t("Customize your store")}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          {t("Update your store settings")}
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4 space-y-6">
          <View className="mb-4">
            <ShopStatus
              isLiveShop={formData.isLiveShop}
              onChange={(value) => handleChange("isLiveShop", value)}
              msg={msg}
            />
          </View>

          <ShopHours
            openingTime={formData.openingTime}
            closingTime={formData.closingTime}
            onChangeOpening={(value) => handleChange("openingTime", value)}
            onChangeClosing={(value) => handleChange("closingTime", value)}
            msg={msg}
            error={errors.openingTime || errors.closingTime}
          />

          <ProductCategoriesDropdown
            categories={[
              t("Grocery"),
              t("Beauty & Personal Care"),
              t("Home & Kitchen"),
              t("Stationery"),
              t("Toys & Games"),
              t("Agriculture"),
              t("Handcraft"),
            ]}
            selectedCategories={formData.productCategories}
            onSelectionChange={(categories) =>
              handleChange("productCategories", categories)
            }
            error={errors.productCategories}
          />

          <DefaultSettings
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            t={t}
          />

          <LocationAvailability
            locationAvailability={formData.locationAvailability}
            city={formData.city}
            customRadius={formData.customRadius}
            building={formData.building}
            locality={formData.locality}
            pinCode={formData.pinCode}
            onLocationChange={(value) =>
              handleChange("locationAvailability", value)
            }
            onCityChange={(value) => handleChange("city", value)}
            onRadiusChange={(value) => handleChange("customRadius", value)}
            onBuildingChange={(value) => handleChange("building", value)}
            onLocalityChange={(value) => handleChange("locality", value)}
            onPinCodeChange={(value) => handleChange("pinCode", value)}
            errors={errors}
            msg={msg}
            t={t}
          />

          {uiError ? (
            <View className="px-4 py-2 bg-red-100 border-l-4 border-red-500">
              <Text className="text-red-700">{uiError}</Text>
            </View>
          ) : null}

          <SubmitButton
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            messages={msg.alerts}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateShop;
