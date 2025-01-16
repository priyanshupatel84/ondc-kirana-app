// import {
//   View,
//   Text,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from "react-native";
// import React, { useState } from "react";
// import { Button } from "~/components/ui/button";
// import { useRouter } from "expo-router";
// import { pickImage } from "../../utils/imagePicker";
// import { useTranslation } from "react-i18next";
// import messages from "./messages";
// import LogoUpload from "./components/LogoUpload";
// import BasicDetails from "./components/BasicDetails";
// import { Progress } from "~/components/ui/progress";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const StoreForm = () => {
//   const { token, setShopId, logout, setUser, user, kyc } = useAuth();
//   const { t } = useTranslation();
//   const msg = messages(t);
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: kyc?.storeName || "",
//     location: kyc?.address || "",
//     city: "",
//     pinCode: "",
//     state: "",
//     country: "India",
//     supportEmail: user?.email || "",
//     supportMobile: user?.mob_no || "",
//     logo: "",
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (key, value) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//     setErrors((prev) => ({ ...prev, [key]: undefined }));
//   };

//   const handleLogoPress = async () => {
//     const uri = await pickImage();
//     if (uri) {
//       handleChange("logo", uri);
//     }
//   };

//   const handleSubmit = async () => {
//     console.log("Store Details Submitted", formData);
//     const formErrors = {};
//     setErrors(formErrors);

//     // Check for required fields (you can add more validation here)
//     if (!formData.name) formErrors.name = "Shop name is required.";
//     if (!formData.location) formErrors.location = "Shop location is required.";
//     if (!formData.city) formErrors.city = "City is required.";
//     if (!formData.pinCode) formErrors.pinCode = "PIN code is required.";
//     if (!formData.state) formErrors.state = "State is required.";
//     if (!formData.country) formErrors.country = "Country is required.";
//     if (!formData.supportEmail)
//       formErrors.supportEmail = "Support email is required.";
//     if (!formData.supportMobile)
//       formErrors.supportMobile = "Support mobile number is required.";

//     setErrors(formErrors);

//     if (Object.keys(formErrors).length === 0) {
//       console.log("Store Details Submitted", formData);
//       try {
//         const dataToSend = {
//           name: formData.name,
//           location: formData.location,
//           city: formData.city,
//           pinCode: formData.pinCode,
//           state: formData.state,
//           country: formData.country,
//           supportEmail: formData.supportEmail,
//           supportMobile: formData.supportMobile,
//         };

//         const response = await axios.post(
//           `http://192.168.29.237:3000/api/shops/register`,
//           dataToSend,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.status === 201) {
//           console.log("Shop registered successfully!", response.data);
//           const updatedUser = response.data.user;
//           await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
//           setUser(updatedUser);
//           setShopId(response.data.shop._id);
//           router.replace("./configureStore");
//         }
//       } catch (error) {
//         if (error.response && error.response.status === 401) {
//           console.log("Token expired or invalid. Logging out.");
//           await logout();
//         } else {
//           console.error("Error registering shop:", error);
//           setErrors({ submit: "Failed to register shop. Please try again." });
//         }
//       }
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <KeyboardAvoidingView
//         className="flex-1 bg-white"
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={40}
//       >
//         <Progress value={61} className="web:w-[60%]" />
//         <Text className="text-[23px] mt-2 font-semibold text-center">
//           {t("Store Details")}
//         </Text>
//         <View className="flex-1 p-3">
//           <ScrollView className="flex-1 px-3" persistentScrollbar={true}>
//             <LogoUpload
//               logo={formData.logo}
//               onLogoPress={handleLogoPress}
//               t={t}
//             />

//             <BasicDetails
//               formData={formData}
//               errors={errors}
//               handleChange={handleChange}
//               msg={msg}
//             />
//             {errors.submit && (
//               <Text className="text-red-500">{errors.submit}</Text>
//             )}
//             <Button
//               size="lg"
//               onPress={handleSubmit}
//               className="mt-4 mb-2 mx-auto w-full bg-blue-500"
//             >
//               <Text className="text-white font-semibold text-xl">
//                 {t("Submit")}
//               </Text>
//             </Button>
//           </ScrollView>
//         </View>
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// };

// export default StoreForm;

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

const StoreForm = () => {
  const { token, setShopId, logout, setUser, user, kyc } = useAuth();
  const { t } = useTranslation();
  const msg = messages(t);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: kyc?.storeName || "",
    logo: "", // Will store URI initially, then URL after upload
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

      // If there's a logo URI, upload it and update the logo field
      if (formData.logo && formData.logo.startsWith("file://")) {
        try {
          const logoUrl = await uploadToCloudinary(formData.logo);
          submitData.logo = logoUrl; // Replace URI with URL
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          setErrors({ submit: "Failed to upload logo. Please try again." });
          setIsSubmitting(false);
          return;
        }
      }

      const response = await axios.post(
        `http://192.168.29.237:3000/api/shops/register`,
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
        setShopId(response.data.shop._id);
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
            Please provide your shop information
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
