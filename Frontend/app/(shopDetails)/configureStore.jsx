// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import axios from "axios";
// import { useRouter } from "expo-router";
// import ShopStatus from "./components/ShopStatus";
// import ShopHours from "./components/ShopHours";
// import ProductCategoriesDropdown from "./components/ProductCategoriesDropdown";
// import DefaultSettings from "./components/DefaultSettings";
// import LocationAvailability from "./components/LocationAvailability";
// import messages from "./messages";
// import { useTranslation } from "react-i18next";
// import { Progress } from "~/components/ui/progress";
// import { useAuth } from "../context/AuthContext";

// const ConfigureStore = () => {
//   const { t } = useTranslation();
//   const msg = messages(t); // Get translated messages
//   const { token, shopId, logout } = useAuth();
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     isLiveShop: false,
//     openingTime: null,
//     closingTime: null,
//     productCategories: [],
//     locationAvailability: "PAN India",
//     city: "",
//     customRadius: "",
//     defaultCancellableSetting: false,
//     defaultReturnableSetting: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     if (errors[field]) {
//       setErrors((prev) => ({
//         ...prev,
//         [field]: null,
//       }));
//     }
//   };

//   const validateForm = () => {
//     const validationErrors = {};
//     if (!formData.openingTime) {
//       validationErrors.openingTime = msg.validationMessages.required;
//     }
//     if (!formData.closingTime) {
//       validationErrors.closingTime = msg.validationMessages.required;
//     }
//     if (!formData.productCategories.length) {
//       validationErrors.productCategories = msg.validationMessages.required;
//     }
//     if (formData.locationAvailability === "City" && !formData.city) {
//       validationErrors.city = msg.validationMessages.cityRequired;
//     }
//     if (formData.locationAvailability === "Custom") {
//       if (!formData.customRadius) {
//         validationErrors.customRadius =
//           msg.validationMessages.deliveryRadiusRequired;
//       }
//     }
//     return validationErrors;
//   };

//   const handleSubmit = async () => {
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       Alert.alert(msg.alerts.validationError, msg.alerts.checkFields, [
//         { text: msg.alerts.ok, style: "default" },
//       ]);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const submissionData = {
//         isLiveShop: formData.isLiveShop,
//         openingTime: formData.openingTime,
//         closingTime: formData.closingTime,
//         productCategories: formData.productCategories,
//         customRadius: formData.customRadius,
//         locationAvailability: formData.locationAvailability,
//         defaultCancellableSetting: formData.defaultCancellableSetting,
//         defaultReturnableSetting: formData.defaultReturnableSetting,
//       };

//       const response = await axios.patch(
//         `http://192.168.29.237:3000/api/shops/${shopId}`,
//         submissionData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       Alert.alert(msg.alerts.success, msg.alerts.storeSaved, [
//         { text: msg.alerts.ok, style: "default" },
//       ]);
//       router.replace("../(tabs)/home");
//     } catch (error) {
//       console.error("Error updating shop:", error);
//       if (error.response && error.response.status === 401) {
//         await logout();
//       } else {
//         Alert.alert(msg.alerts.error, msg.alerts.saveFailed, [
//           { text: msg.alerts.ok, style: "default" },
//         ]);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <View className="flex-1 bg-gray-50">
//       <Progress value={81} className="web:w-[60%]" />

//       <View className="px-4 py-3 border-b border-gray-200">
//         <Text className="text-2xl font-semibold text-gray-800">
//           Customize your store
//         </Text>
//         <Text className="text-sm text-gray-500 mt-1">
//           Customize your store settings
//         </Text>
//       </View>
//       <ScrollView className="flex-1">
//         <View className="p-4 space-y-6">
//           <ShopStatus
//             isLiveShop={formData.isLiveShop}
//             onChange={(value) => handleChange("isLiveShop", value)}
//             msg={msg}
//           />

//           <ShopHours
//             openingTime={formData.openingTime}
//             closingTime={formData.closingTime}
//             onChangeOpening={(value) => handleChange("openingTime", value)}
//             onChangeClosing={(value) => handleChange("closingTime", value)}
//             msg={msg}
//             error={errors.openingTime || errors.closingTime}
//           />

//           <ProductCategoriesDropdown
//             categories={[
//               "Grocery",
//               "Electronics",
//               "Clothing",
//               "Furniture",
//               "Books",
//               "Toys",
//               "Sports",
//               "Beauty",
//             ]}
//             selectedCategories={formData.productCategories}
//             onSelectionChange={(categories) =>
//               handleChange("productCategories", categories)
//             }
//             error={errors.productCategories}
//           />

//           <DefaultSettings
//             formData={formData}
//             handleChange={handleChange}
//             errors={errors}
//             t={t}
//           />

//           <LocationAvailability
//             locationAvailability={formData.locationAvailability}
//             city={formData.city}
//             customRadius={formData.customRadius}
//             building={formData.building}
//             locality={formData.locality}
//             pinCode={formData.pinCode}
//             onLocationChange={(value) =>
//               handleChange("locationAvailability", value)
//             }
//             onCityChange={(value) => handleChange("city", value)}
//             onRadiusChange={(value) => handleChange("customRadius", value)}
//             onBuildingChange={(value) => handleChange("building", value)}
//             onLocalityChange={(value) => handleChange("locality", value)}
//             onPinCodeChange={(value) => handleChange("pinCode", value)}
//             errors={errors}
//             msg={msg}
//             t={t}
//           />

//           <TouchableOpacity
//             onPress={handleSubmit}
//             disabled={isSubmitting}
//             className={`rounded-xl py-4 px-6 my-4 flex-row justify-center items-center shadow-sm ${
//               isSubmitting ? "bg-blue-300" : "bg-blue-600"
//             }`}
//             activeOpacity={0.8}
//           >
//             {isSubmitting ? (
//               <View className="flex-row items-center">
//                 <Text className="text-white font-semibold text-lg mr-2">
//                   {msg.alerts.saving}
//                 </Text>
//                 <MaterialIcons name="sync" size={24} color="white" />
//               </View>
//             ) : (
//               <View className="flex-row items-center">
//                 <Text className="text-white font-semibold text-lg mr-2">
//                   {msg.alerts.saveConfiguration}
//                 </Text>
//                 <MaterialIcons name="check-circle" size={24} color="white" />
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default ConfigureStore;
import React, { useState } from "react";
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
import { Progress } from "~/components/ui/progress";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const ConfigureStore = () => {
  const { t } = useTranslation();
  const msg = messages(t);
  const { token, shopId, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    isLiveShop: true,
    openingTime: null,
    closingTime: null,
    productCategories: [],
    locationAvailability: "PAN India",
    city: "",
    customRadius: "",
    defaultCancellableSetting: false,
    defaultReturnableSetting: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uiError, setUiError] = useState("");

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
    if (formData.locationAvailability === "Custom") {
      if (!formData.customRadius) {
        validationErrors.customRadius =
          msg.validationMessages.deliveryRadiusRequired;
      }
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
        customRadius: formData.customRadius,
        locationAvailability: formData.locationAvailability,
        defaultCancellableSetting: formData.defaultCancellableSetting,
        defaultReturnableSetting: formData.defaultReturnableSetting,
      };

      await axios.patch(`${API_URL}/api/shops/${shopId}`, submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSaveSuccess(true);
      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 400);
    } catch (error) {
      console.error("Error updating shop:", error);
      if (error.response && error.response.status === 401) {
        await logout();
      } else {
        setUiError(msg.alerts.saveFailed);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Progress value={81} className="web:w-[60%]" />

      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-semibold text-gray-800">
          Customize your store
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Customize your store settings
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
              "Grocery",
              "Electronics",
              "Clothing",
              "Furniture",
              "Books",
              "Toys",
              "Sports",
              "Beauty",
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
            saveSuccess={saveSuccess}
            onSubmit={handleSubmit}
            messages={msg.alerts}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ConfigureStore;
