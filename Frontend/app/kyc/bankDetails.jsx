import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { validateBankDetails } from "./validation";
import { useRouter } from "expo-router";

const BankDetails = () => {
  const router = useRouter();
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [cancelledCheque, setCancelledCheque] = useState("");

  const [errors, setErrors] = useState({});

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    console.log(result);

    // Check if the document selection was successful
    if (result && !result.canceled) {
      const selectedAsset = result.assets[0]; // Access the first asset
      console.log("File Name:", selectedAsset.name);
      console.log("File URI:", selectedAsset.uri);

      // Update the cancelled cheque name
      setCancelledCheque(selectedAsset.name);
    } else {
      console.log("Document selection was canceled");
    }
  };

  const handleSubmit = () => {
    const formData = {
      accountHolderName,
      accountNumber,
      bankName,
      branchName,
      ifscCode,
      cancelledCheque,
    };

    // Use the validation function from Validation.js
    const { isValid, errors } = validateBankDetails(formData);

    if (isValid) {
      setErrors({});
      console.log("Bank Details Submitted", formData);
      router.push("/(tabs)");
    } else {
      setErrors(errors);
    }
  };

  return (
    <View className="items-center justify-center p-4 w-full">
      <View className="h-[540px] w-full p-2">
        <Text className="text-3xl font-semibold text-center py-2">
          Bank Details
        </Text>
        <ScrollView className="p-3" persistentScrollbar={true}>
          <View className="mb-3">
            <Label
              nativeID="accountHolderName"
              className="mb-1 text-lg font-semibold"
            >
              Account Holder Name *
            </Label>
            <Input
              className="border border-gray-300 p-2 rounded"
              placeholder="Enter Account Holder Name"
              value={accountHolderName}
              onChangeText={setAccountHolderName}
            />
            {errors.accountHolderName && (
              <Text className="text-red-500">{errors.accountHolderName}</Text>
            )}
          </View>

          <View className="mb-3">
            <Label
              nativeID="accountNumber"
              className="mb-1 text-lg font-semibold"
            >
              Account Number *
            </Label>
            <Input
              className="border border-gray-300 p-2 rounded"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
            />
            {errors.accountNumber && (
              <Text className="text-red-500">{errors.accountNumber}</Text>
            )}
          </View>

          <View className="mb-3">
            <Label nativeID="bankName" className="mb-1 text-lg font-semibold">
              Bank Name *
            </Label>
            <Input
              className="border border-gray-300 p-2 rounded"
              placeholder="Enter Bank Name"
              value={bankName}
              onChangeText={setBankName}
            />
            {errors.bankName && (
              <Text className="text-red-500">{errors.bankName}</Text>
            )}
          </View>

          <View className="mb-3">
            <Label nativeID="branchName" className="mb-1 text-lg font-semibold">
              Branch Name *
            </Label>
            <Input
              className="border border-gray-300 p-2 rounded"
              placeholder="Enter Branch Name"
              value={branchName}
              onChangeText={setBranchName}
            />
            {errors.branchName && (
              <Text className="text-red-500">{errors.branchName}</Text>
            )}
          </View>

          <View className="mb-3">
            <Label nativeID="ifscCode" className="mb-1 text-lg font-semibold">
              IFSC Code *
            </Label>
            <Input
              className="border border-gray-300 p-2 rounded"
              placeholder="Enter IFSC Code"
              value={ifscCode}
              onChangeText={setIfscCode}
            />
            {errors.ifscCode && (
              <Text className="text-red-500">{errors.ifscCode}</Text>
            )}
          </View>

          <View className="mb-3">
            <Label
              nativeID="cancelledCheque"
              className="mb-1 text-lg font-semibold"
            >
              Cancelled Cheque *
            </Label>
            <TouchableOpacity
              className="p-2 bg-gray-100 mt-1 border border-gray-300 rounded"
              onPress={pickDocument}
            >
              {cancelledCheque ? (
                <Text className="text-green-600">
                  Uploaded: {cancelledCheque}
                </Text>
              ) : (
                <Text>Upload Cancelled Cheque</Text>
              )}
            </TouchableOpacity>
            {errors.cancelledCheque && (
              <Text className="text-red-500">{errors.cancelledCheque}</Text>
            )}
          </View>
        </ScrollView>
      </View>
      <Button
        size="lg"
        variant="destructive"
        onPress={handleSubmit}
        className="mt-4 w-[320px] bg-blue-500 active:bg-blue-400"
      >
        <Text className="text-white font-semibold text-xl">Submit</Text>
      </Button>
    </View>
  );
};

export default BankDetails;
