// import {
//   View,
//   Text,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Image,
//   TouchableOpacity,
// } from "react-native";
// import React, { useState } from "react";
// import { Input } from "~/components/ui/input";
// import { Label } from "~/components/ui/label";
// import { Button } from "~/components/ui/button";
// import { useRouter } from "expo-router";
// import { pickImage } from "../../utils/imagePicker";
// import { MaterialIcons } from "@expo/vector-icons";
// import { Switch } from "~/components/ui/switch";
// import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

// const StoreForm = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     supportEmail: "",
//     supportMobile: "",
//     productCategories: "",
//     storeLocation: "",
//     locationAvailability: "PAN India",
//     customRadius: "",
//     city: "", // Add city field
//     defaultCancellableSetting: false,
//     defaultReturnableSetting: false,
//     country: "",
//     state: "",
//     building: "",
//     pinCode: "",
//     locality: "",
//     logo: null,
//   });
//   const [errors, setErrors] = useState({});

//   const locationOptions = [
//     { value: "PAN India", label: "PAN India" },
//     { value: "City", label: "City Only" },
//     { value: "Custom", label: "Custom Area" },
//   ];

//   const RadioGroupItemWithLabel = ({ value, label, onLabelPress }) => {
//     return (
//       <View className="flex-row gap-2 items-center">
//         <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
//         <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
//           {label}
//         </Label>
//       </View>
//     );
//   };

//   const inputFields = [
//     {
//       label: "Support Email",
//       key: "supportEmail",
//       placeholder: "Enter Support Email",
//     },
//     {
//       label: "Support Mobile Number",
//       key: "supportMobile",
//       placeholder: "Enter Support Mobile Number",
//       keyboardType: "numeric",
//     },
//     {
//       label: "Supported Product Categories",
//       key: "productCategories",
//       placeholder: "Enter Supported Product Categories",
//     },
//     {
//       label: "Store Location",
//       key: "storeLocation",
//       placeholder: "Search location!",
//     },
//     {
//       label: "Country",
//       key: "country",
//       placeholder: "Enter Country",
//     },
//     {
//       label: "State",
//       key: "state",
//       placeholder: "Enter State",
//     },
//     {
//       label: "Building",
//       key: "building",
//       placeholder: "Enter Building",
//     },
//     {
//       label: "PIN Code",
//       key: "pinCode",
//       placeholder: "Enter PIN Code",
//       keyboardType: "numeric",
//     },
//     {
//       label: "Locality",
//       key: "locality",
//       placeholder: "Enter Locality",
//     },
//   ];

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

//   const handleSubmit = () => {
//     const formErrors = {};
//     // Add validation here if needed
//     setErrors(formErrors);

//     if (Object.keys(formErrors).length === 0) {
//       console.log("Store Details Submitted", formData);
//       router.replace("../(tabs)/home");
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <KeyboardAvoidingView
//         className="flex-1 bg-white"
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={40}
//       >
//         <Text className="text-[23px] mt-2 font-semibold text-center">
//           Store Details
//         </Text>
//         <View className="flex-1 p-3">
//           <ScrollView className="flex-1 px-3" persistentScrollbar={true}>
//             <TouchableOpacity
//               className="p-1 m-2 mt-0"
//               onPress={handleLogoPress}
//             >
//               <View className="w-3/4 h-56 border border-blue-700 rounded-2xl self-center justify-center items-center bg-blue-50">
//                 {formData.logo ? (
//                   <Image
//                     source={{ uri: formData.logo }}
//                     className="w-64 h-52"
//                     resizeMode="contain"
//                   />
//                 ) : (
//                   <View className="items-center">
//                     <MaterialIcons name="upload" size={56} color="#1d4ed8" />
//                     <Text className="text-center text-xl text-blue-700 font-semibold">
//                       Upload Logo
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </TouchableOpacity>

//             {inputFields.map(({ label, key, placeholder, keyboardType }) => (
//               <View className="mb-3" key={key}>
//                 <Label nativeID={key} className="mb-1 text-lg font-semibold">
//                   {label}
//                 </Label>
//                 {key !== "logo" &&
//                   key !== "defaultCancellableSetting" &&
//                   key !== "defaultReturnableSetting" && (
//                     <Input
//                       className="p-2 rounded"
//                       placeholder={placeholder}
//                       value={formData[key]}
//                       onChangeText={(value) => handleChange(key, value)}
//                       keyboardType={keyboardType}
//                       aria-labelledby={key}
//                       aria-errormessage={`${key}Error`}
//                     />
//                   )}
//                 {errors[key] ? (
//                   <Text className="text-red-500">{errors[key]}</Text>
//                 ) : null}
//               </View>
//             ))}

//             <View className="flex-row justify-between rounded-lg">
//               <View className="w-[48%] mb-3 border-2 border-gray-300 p-2 rounded-lg">
//                 <Label
//                   nativeID="defaultCancellableSetting"
//                   className="mb-1 text-lg font-semibold"
//                 >
//                   Default Cancellable
//                 </Label>
//                 <Switch
//                   checked={formData.defaultCancellableSetting}
//                   onCheckedChange={(value) =>
//                     handleChange("defaultCancellableSetting", value)
//                   }
//                   nativeID="defaultCancellableSetting"
//                 />
//               </View>

//               <View className="w-[48%] mb-3 border-2 border-gray-300 p-2 rounded-lg">
//                 <Label
//                   nativeID="defaultReturnableSetting"
//                   className="mb-1 text-lg font-semibold"
//                 >
//                   Default Returnable
//                 </Label>
//                 <Switch
//                   checked={formData.defaultReturnableSetting}
//                   onCheckedChange={(value) =>
//                     handleChange("defaultReturnableSetting", value)
//                   }
//                   nativeID="defaultReturnableSetting"
//                 />
//               </View>
//             </View>

//             {/* Location Availability Radio Group */}
//             <View className="mb-3">
//               <Label className="mb-1 text-lg font-semibold">
//                 Location Availability
//               </Label>
//               <View className="border-2 border-gray-300 p-3 rounded-lg">
//                 <RadioGroup
//                   value={formData.locationAvailability}
//                   onValueChange={(value) =>
//                     handleChange("locationAvailability", value)
//                   }
//                   className="gap-3"
//                 >
//                   {locationOptions.map((option) => (
//                     <RadioGroupItemWithLabel
//                       key={option.value}
//                       value={option.value}
//                       label={option.label}
//                       onLabelPress={() =>
//                         handleChange("locationAvailability", option.value)
//                       }
//                     />
//                   ))}
//                 </RadioGroup>

//                 {/* City Input Field */}
//                 {formData.locationAvailability === "City" && (
//                   <View className="mt-3 border-t border-gray-200 pt-3">
//                     <Label className="mb-1 text-base">City Name</Label>
//                     <Input
//                       className="p-2 rounded"
//                       placeholder="Enter City Name"
//                       value={formData.city}
//                       onChangeText={(value) => handleChange("city", value)}
//                       aria-labelledby="city"
//                     />
//                   </View>
//                 )}

//                 {/* Custom Radius Input */}
//                 {formData.locationAvailability === "Custom" && (
//                   <View className="mt-3 border-t border-gray-200 pt-3">
//                     <Label className="mb-1 text-base">
//                       Delivery Radius (in km)
//                     </Label>
//                     <Input
//                       className="p-2 rounded mt-1"
//                       placeholder="Enter delivery radius in kilometers"
//                       value={formData.customRadius}
//                       onChangeText={(value) =>
//                         handleChange("customRadius", value)
//                       }
//                       keyboardType="numeric"
//                       aria-labelledby="customRadius"
//                     />
//                   </View>
//                 )}
//               </View>
//             </View>

//             <Button
//               size="lg"
//               onPress={handleSubmit}
//               className="mt-4 mb-2 mx-auto w-full bg-blue-500"
//             >
//               <Text className="text-white font-semibold text-xl">Submit</Text>
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
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { pickImage } from "../../utils/imagePicker";
import { MaterialIcons } from "@expo/vector-icons";
import { Switch } from "~/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import messages from "./messages";
import { useTranslation } from "react-i18next";

const StoreForm = () => {
  const { t } = useTranslation();
  const msg = messages(t);
  const router = useRouter();
  const [formData, setFormData] = useState({
    supportEmail: "",
    supportMobile: "",
    productCategories: "",
    storeLocation: "",
    locationAvailability: "PAN India",
    customRadius: "",
    city: "",
    defaultCancellableSetting: false,
    defaultReturnableSetting: false,
    country: "",
    state: "",
    building: "",
    pinCode: "",
    locality: "",
    logo: null,
    isLiveShop: false,
    openingTime: "09:00",
    closingTime: "18:00",
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

  const handleSubmit = () => {
    const formErrors = {};
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      console.log("Store Details Submitted", formData);
      router.replace("../(tabs)/home");
    }
  };

  const RadioGroupItemWithLabel = ({ value, label, onLabelPress }) => {
    return (
      <View className="flex-row gap-2 items-center">
        <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
        <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
          {label}
        </Label>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
      >
        <Text className="text-[23px] mt-2 font-semibold text-center">
          {t("Store Details")}
        </Text>
        <View className="flex-1 p-3">
          <ScrollView className="flex-1 px-3" persistentScrollbar={true}>
            {/* Logo Upload Section */}
            <TouchableOpacity
              className="p-1 m-2 mt-0"
              onPress={handleLogoPress}
            >
              <View className="w-3/4 h-56 border border-blue-700 rounded-2xl self-center justify-center items-center bg-blue-50">
                {formData.logo ? (
                  <Image
                    source={{ uri: formData.logo }}
                    className="w-64 h-52"
                    resizeMode="contain"
                  />
                ) : (
                  <View className="items-center">
                    <MaterialIcons name="upload" size={56} color="#1d4ed8" />
                    <Text className="text-center text-xl text-blue-700 font-semibold">
                      {t("Upload Logo")}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* Live Shop Status */}
            <View className="mb-4 border-2 border-gray-300 p-3 rounded-lg">
              <View className="flex-row justify-between items-center">
                <Label className="text-lg font-semibold">
                  {msg.formLabels.liveShopStatus}
                </Label>
                <Switch
                  checked={formData.isLiveShop}
                  onCheckedChange={(value) => handleChange("isLiveShop", value)}
                />
              </View>
              <Text className="text-sm text-gray-500 mt-1">
                {formData.isLiveShop
                  ? msg.shopStatus.live
                  : msg.shopStatus.offline}
              </Text>
            </View>

            {/* Shop Hours */}
            <View className="mb-4 border-2 border-gray-300 p-3 rounded-lg">
              <Label className="text-lg font-semibold mb-2">
                {msg.formLabels.shopHours}
              </Label>
              <View className="flex-row justify-between">
                <View className="w-[48%]">
                  <Label className="mb-1">{msg.formLabels.openingTime}</Label>
                  <Input
                    className="p-2 rounded"
                    type="time"
                    value={formData.openingTime}
                    onChangeText={(value) => handleChange("openingTime", value)}
                    placeholder={msg.formPlaceholder.openingTime}
                  />
                </View>
                <View className="w-[48%]">
                  <Label className="mb-1">{msg.formLabels.closingTime}</Label>
                  <Input
                    className="p-2 rounded"
                    type="time"
                    value={formData.closingTime}
                    onChangeText={(value) => handleChange("closingTime", value)}
                    placeholder={msg.formPlaceholder.closingTime}
                  />
                </View>
              </View>
            </View>

            {/* Basic Details */}
            {Object.keys(msg.formLabels).map((key) => {
              // Skip the new fields that we're handling separately
              if (
                [
                  "liveShopStatus",
                  "shopHours",
                  "openingTime",
                  "closingTime",
                ].includes(key)
              ) {
                return null;
              }
              return (
                <View className="mb-3" key={key}>
                  <Label nativeID={key} className="mb-1 text-lg font-semibold">
                    {msg.formLabels[key]}
                  </Label>
                  <Input
                    className="p-2 rounded"
                    placeholder={msg.formPlaceholder[key]}
                    value={formData[key]}
                    onChangeText={(value) => handleChange(key, value)}
                    aria-labelledby={key}
                  />
                  {errors[key] ? (
                    <Text className="text-red-500">{errors[key]}</Text>
                  ) : null}
                </View>
              );
            })}

            {/* Default Settings */}
            <View className="flex-row justify-between rounded-lg">
              <View className="w-[48%] mb-3 border-2 border-gray-300 p-2 rounded-lg">
                <Label
                  nativeID="defaultCancellableSetting"
                  className="mb-1 text-lg font-semibold"
                >
                  {t("Default Cancellable")}
                </Label>
                <Switch
                  checked={formData.defaultCancellableSetting}
                  onCheckedChange={(value) =>
                    handleChange("defaultCancellableSetting", value)
                  }
                  nativeID="defaultCancellableSetting"
                />
              </View>

              <View className="w-[48%] mb-3 border-2 border-gray-300 p-2 rounded-lg">
                <Label
                  nativeID="defaultReturnableSetting"
                  className="mb-1 text-lg font-semibold"
                >
                  {t("Default Returnable")}
                </Label>
                <Switch
                  checked={formData.defaultReturnableSetting}
                  onCheckedChange={(value) =>
                    handleChange("defaultReturnableSetting", value)
                  }
                  nativeID="defaultReturnableSetting"
                />
              </View>
            </View>

            {/* Location Availability */}
            <View className="mb-3">
              <Label className="mb-1 text-lg font-semibold">
                {t("Location Availability")}
              </Label>
              <View className="border-2 border-gray-300 p-3 rounded-lg">
                <RadioGroup
                  value={formData.locationAvailability}
                  onValueChange={(value) =>
                    handleChange("locationAvailability", value)
                  }
                  className="gap-3"
                >
                  {msg.locationOptions.map((option) => (
                    <RadioGroupItemWithLabel
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      onLabelPress={() =>
                        handleChange("locationAvailability", option.value)
                      }
                    />
                  ))}
                </RadioGroup>

                {formData.locationAvailability === "City" && (
                  <View className="mt-3 border-t border-gray-200 pt-3">
                    <Label className="mb-1 text-base">{t("City Name")}</Label>
                    <Input
                      className="p-2 rounded"
                      placeholder={msg.formPlaceholder.city}
                      value={formData.city}
                      onChangeText={(value) => handleChange("city", value)}
                      aria-labelledby="city"
                    />
                  </View>
                )}

                {formData.locationAvailability === "Custom" && (
                  <View className="mt-3 border-t border-gray-200 pt-3">
                    <Label className="mb-1 text-base">
                      {msg.formLabels.deliveryRadius}
                    </Label>
                    <Input
                      className="p-2 rounded mt-1"
                      placeholder={msg.formPlaceholder.deliveryRadius}
                      value={formData.customRadius}
                      onChangeText={(value) =>
                        handleChange("customRadius", value)
                      }
                      keyboardType="numeric"
                      aria-labelledby="customRadius"
                    />
                  </View>
                )}
              </View>
            </View>

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
