import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { validateKYCForm } from "./validation";
import { Checkbox } from "~/components/ui/checkbox"; // Import the Checkbox component
import { Progress } from "~/components/ui/progress";
import { getVerifiedData } from "../helperFunction/UseDocumentData"; // Import the custom hook

const KYCForm = () => {
  const router = useRouter();
  const documentData = getVerifiedData();
  const [formData, setFormData] = useState({
    storeName: "",
    registeredAddress: "",
    email: "",
    mobile: "",
    pan: "",
    gstin: "",
    fssaiNumber: "",
    gstinCertificateImage: "",
    panCardImage: "",
    addressProofImage: "",
    IdCardImage: "",
  });
  const [checked, setChecked] = useState(false); // Checkbox state
  const [checkboxError, setCheckboxError] = useState(""); // Checkbox error message
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (documentData) {
      documentData.forEach((doc) => {
        const docType = Object.keys(doc)[0];
        const data = doc[docType];

        if (docType === "GSTINCertificate") {
          const [isValid, ShopName, address, gstinNum, base64Image] = data;
          if (isValid) {
            setFormData((prevData) => ({
              ...prevData,
              storeName: ShopName || prevData.storeName,
              registeredAddress: address || prevData.registeredAddress,
              gstin: gstinNum || prevData.gstin,
              gstinCertificateImage:
                base64Image || prevData.gstinCertificateImage,
            }));
          }
        } else if (docType === "PANCard") {
          const [isValid, panNumber, panHolderName, base64Image] = data;
          if (isValid) {
            setFormData((prevData) => ({
              ...prevData,
              pan: panNumber || prevData.pan,
              panCardImage: base64Image || prevData.panCardImage,
            }));
          }
        }
      });
    }
  }, [documentData]);

  const inputFields = [
    {
      label: "Provider Store Name",
      key: "storeName",
      placeholder: "Enter Provider Store Name",
    },
    {
      label: "Registered Address",
      key: "registeredAddress",
      placeholder: "Enter Provider Registered Address",
    },
    {
      label: "Email",
      key: "email",
      placeholder: "Enter Provider Email Address",
    },
    {
      label: "Mobile Number",
      key: "mobile",
      placeholder: "Enter Provider Mobile Number",
      keyboardType: "numeric",
    },
    {
      label: "PAN",
      key: "pan", // This should match the key in formData
      placeholder: "Enter Provider PAN",
    },
    {
      label: "GSTIN",
      key: "gstin",
      placeholder: "Enter Provider GSTIN",
    },
    {
      label: "FSSAI Number",
      key: "fssaiNumber",
      placeholder: "Enter Provider FSSAI Number",
    },
  ];

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Clear the error for the specific field being edited
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = () => {
    // Validate KYC Form
    const { isValid: isFormValid, errors: formErrors } =
      validateKYCForm(formData);

    // Combine errors
    setErrors(formErrors);

    // Check if checkbox is checked
    if (!checked) {
      setCheckboxError("Please select the checkbox to proceed.");
      return; // Prevent submission if checkbox is not checked
    } else {
      setCheckboxError(""); // Clear error if checked
    }

    if (isFormValid) {
      console.log("KYC Details Submitted", formData);
      router.replace("../../(shopDetails)"); // Navigate to the next route
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40} // Adjust this value as needed
      >
        <Progress value={41} className="web:w-[60%]" />
        <View className="flex-1 p-4">
          <Text className="text-3xl my-3 font-semibold text-center">
            KYC Details
          </Text>
          <ScrollView className="flex-1 px-3 " persistentScrollbar={true}>
            {inputFields.map(({ label, key, placeholder }) => (
              <View className="mb-3" key={key}>
                <Label nativeID={key} className="mb-1 text-lg font-semibold">
                  {label}
                </Label>
                <Input
                  className="p-2 border border-gray-300 rounded"
                  placeholder={placeholder}
                  value={formData[key]}
                  onChangeText={(value) => handleChange(key, value)}
                  aria-labelledby={key}
                  aria-errormessage={`${key}Error`}
                />
                {errors[key] ? (
                  <Text className="text-red-500">{errors[key]}</Text>
                ) : null}
              </View>
            ))}
            <View className="m-1 flex items-center flex-row">
              <Checkbox
                checked={checked}
                onCheckedChange={setChecked}
                className={`${checked ? "bg-blue-500" : "bg-white"} p-1`}
              />
              <Text className="ml-2">
                I verify and confirm that all details are correct.
              </Text>
            </View>
            {checkboxError ? (
              <Text className="text-red-500">{checkboxError}</Text>
            ) : null}
            <Button
              size="lg"
              variant="destructive"
              onPress={handleSubmit}
              className={`mt-4 mb-2 mx-auto w-full ${
                !checked ? "bg-blue-500 opacity-50" : "bg-blue-500"
              } active:bg-blue-400`}
            >
              <Text className="text-white font-semibold text-xl">Submit</Text>
            </Button>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default KYCForm;
