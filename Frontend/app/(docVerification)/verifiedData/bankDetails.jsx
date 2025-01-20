import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import { validateBankDetails } from "./validation";
import { useRouter } from "expo-router";
import { getVerifiedData } from "../helperFunction/UseDocumentData";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Progress } from "~/components/ui/progress";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const BankDetails = () => {
  const { t } = useTranslation();
  const { token, logout } = useAuth();
  const router = useRouter();
  const documentData = getVerifiedData();

  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    cancelledChequeImage: "",
  });
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(false);
  const [checkboxError, setCheckboxError] = useState("");

  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (documentData) {
      documentData.forEach((doc) => {
        const docType = Object.keys(doc)[0];
        const data = doc[docType];

        if (docType === "CancelledBankCheque") {
          const [isValid, name, accountNum, ifsc, bank, branch, imageurl] =
            data;
          if (isValid) {
            setFormData({
              accountHolderName: name,
              accountNumber: accountNum,
              ifscCode: ifsc,
              bankName: bank,
              branchName: branch,
              cancelledChequeImage: imageurl,
            });
          }
        }
      });
    }
  }, [documentData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { isValid, errors: formErrors } = validateBankDetails(formData);

    setErrors(formErrors);

    if (!checked) {
      setCheckboxError("Please, Select the checkbox to proceed");
      return;
    } else {
      setCheckboxError("");
    }

    if (isValid) {
      try {
        const response = await axios.post(
          `${API_URL}/api/bank-account/add`,
          {
            ...formData,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 201) {
          router.replace("./kycDetails");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await logout();
        } else {
          console.error("Error submitting bank details:", error);
          setErrors({
            submit:
              error.response?.data.error ||
              "Failed to submit bank details. Please try again.",
          });
        }
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
        keyboardVerticalOffset={90}
        className="bg-white"
      >
        <Progress value={21} className="web:w-[60%]" />
        <View className="px-4 py-5 border-b border-gray-200">
          <Text className="text-2xl font-semibold text-gray-800">
            {t("Bank Details")}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {t("Please provide your bank account information")}
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
                    {t(label)}
                  </Label>
                  <Input
                    className={"bg-gray-50 rounded-lg"}
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
                        {t(errors[key])}
                      </Text>
                    </View>
                  )}
                </View>
              )
            )}

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
                  {t("I verify that all bank details are correct")}
                </Text>
              </View>
              {checkboxError && (
                <Text className="text-red-500 text-sm mt-2">
                  {t(checkboxError)}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.7}
              className={`h-14 rounded-lg ${
                !checked ? "bg-blue-300" : "bg-blue-500"
              } justify-center my-3`}
              disabled={!checked}
            >
              <Text className="text-white font-semibold text-lg text-center">
                {t("Submit Details")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default BankDetails;
