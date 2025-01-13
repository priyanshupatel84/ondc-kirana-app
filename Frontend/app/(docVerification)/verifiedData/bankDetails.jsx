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
import { Button } from "~/components/ui/button";
import { validateBankDetails } from "./validation";
import { useRouter } from "expo-router";
import { getVerifiedData } from "../helperFunction/UseDocumentData"; // Import the custom hook
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";

const BankDetails = () => {
  const router = useRouter();
  const documentData = getVerifiedData();

  // State variables for bank details and checkbox
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
  });
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(false); // Checkbox state
  const [checkboxError, setCheckboxError] = useState(""); // Checkbox error message

  // Effect to populate state from documentData
  useEffect(() => {
    if (documentData) {
      documentData.forEach((doc) => {
        const docType = Object.keys(doc)[0];
        const data = doc[docType];

        if (docType === "CancelledBankCheque") {
          const [isValid, name, accountNum, ifsc, bank, branch] = data;
          if (isValid) {
            setFormData({
              accountHolderName: name,
              accountNumber: accountNum,
              ifscCode: ifsc,
              bankName: bank,
              branchName: branch,
            });
          }
        }
      });
    }
  }, [documentData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Validate Bank Details
    const { isValid, errors: formErrors } = validateBankDetails(formData);

    // Combine errors
    setErrors(formErrors);

    // Check if checkbox is checked
    if (!checked) {
      setCheckboxError("Please, Select the checkbox to proceed");
      return; // Prevent submission if checkbox is not checked
    } else {
      setCheckboxError(""); // Clear error if checked
    }
    console.log("isValid", isValid);
    if (isValid) {
      console.log("Bank Details Submitted", formData);
      router.push("./kycDetails"); // Navigate to the next route
    }
  };

  // Define the input fields
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
    { label: "IFSC Code", key: "ifscCode", placeholder: "Enter IFSC Code" },
    { label: "Bank Name", key: "bankName", placeholder: "Enter Bank Name" },
    {
      label: "Branch Name",
      key: "branchName",
      placeholder: "Enter Branch Name",
      multiline: true,
      numberOfLines: 4,
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={50} // Adjust this value as needed
      >
        <View className="items-center justify-center p-2 w-full py-5 ">
          <Text className="text-3xl my-3 font-semibold text-center">
            Bank Details
          </Text>
          <ScrollView className="p-3" persistentScrollbar={true}>
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
                  <Label nativeID={key} className="mb-1 text-lg font-semibold">
                    {label}
                  </Label>
                  <Input
                    className="p-2"
                    placeholder={placeholder}
                    value={formData[key]}
                    onChangeText={(value) => handleChange(key, value)}
                    aria-labelledby={key}
                    aria-errormessage={`${key}Error`}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    style={{
                      height: multiline ? 90 : 40,
                      textAlignVertical: multiline ? "top" : "center", // Align text to the top for multiline
                    }}
                  />
                  {errors[key] ? (
                    <Text className="text-red-500">{errors[key]}</Text>
                  ) : null}
                </View>
              )
            )}
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
              className={`mt-4 mb-4 mx-auto w-full ${
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

export default BankDetails;
