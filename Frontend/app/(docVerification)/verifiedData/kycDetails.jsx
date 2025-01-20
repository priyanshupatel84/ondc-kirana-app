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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useRouter } from "expo-router";
import { validateKYCForm } from "./validation";
import { Checkbox } from "~/components/ui/checkbox";
import { Progress } from "~/components/ui/progress";
import { getVerifiedData } from "../helperFunction/UseDocumentData";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useTranslation } from "react-i18next";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const KYCForm = () => {
  const { t } = useTranslation();
  const { token, setUser, user, logout, setKyc } = useAuth();
  const router = useRouter();
  const documentData = getVerifiedData();
  const [formData, setFormData] = useState({
    storeName: "",
    address: "",
    email: user?.email || "",
    mobile: user?.mob_no || "",
    panNumber: "",
    gstin: "",
    fssaiNumber: "",
    panCard: "",
    aadhaarCard: "",
    gstinCertificate: "",
    addressProof: "",
  });
  const [checked, setChecked] = useState(false);
  const [checkboxError, setCheckboxError] = useState("");
  const [errors, setErrors] = useState({});

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

        if (docType === "GSTINCertificate") {
          const [isValid, gstinNum, address, ShopName, imageURL] = data;
          if (isValid) {
            setFormData((prevData) => ({
              ...prevData,
              storeName: ShopName || prevData.storeName,
              address: address || prevData.address,
              gstin: gstinNum || prevData.gstin,
              gstinCertificate: imageURL || prevData.gstinCertificate,
            }));
          }
        } else if (docType === "PANCard") {
          const [isValid, panNumber, panHolderName, imageURL] = data;
          if (isValid) {
            setFormData((prevData) => ({
              ...prevData,
              panNumber: panNumber || prevData.panNumber,
              panCard: imageURL || prevData.panCard,
            }));
          }
        } else if (docType === "AADHAARCard") {
          const [isValid, aadhaarNumber, aadhaarHolderName, imageURL] = data;
          if (isValid) {
            setFormData((prevData) => ({
              ...prevData,
              aadhaarCard: imageURL || prevData.aadhaarCard,
            }));
          }
        } else if (docType === "AddressProof") {
          const [isValid, imageURL] = data;
          if (isValid) {
            setFormData((prevData) => ({
              ...prevData,
              addressProof: imageURL || prevData.addressProof,
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
      key: "address",
      placeholder: "Enter Provider Registered Address",
      multiline: true,
      numberOfLines: 4,
      textAlignVertical: "top",
      style: { height: 80, textAlignVertical: "top", paddingTop: 8 },
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
      maxLength: 10,
    },
    {
      label: "PAN",
      key: "panNumber",
      placeholder: "Enter Provider PAN",
      maxLength: 10,
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
      keyboardType: "numeric",
    },
  ];
  const handleChange = (key, value) => {
    let updatedValue = value;
    if (key === "mobile" || key === "fssaiNumber") {
      updatedValue = value.replace(/[^0-9]/g, "");
    }
    setFormData((prev) => ({ ...prev, [key]: updatedValue }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async () => {
    console.log("Form data:", formData);
    const { isValid, errors: formErrors } = validateKYCForm(formData);
    setErrors(formErrors);

    if (!checked) {
      setCheckboxError("Please select the checkbox to proceed.");
      return;
    } else {
      setCheckboxError("");
    }

    if (isValid) {
      try {
        const submitData = {
          ...formData,
          mobile: formData.mobile ? Number(formData.mobile) : "",
          fssaiNumber: formData.fssaiNumber ? Number(formData.fssaiNumber) : "",
        };

        const response = await axios.post(
          `${API_URL}/api/kyc/submit`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          const updatedUser = response.data.user;
          await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          setKyc(response.data.kyc);
          router.replace("../../(shopDetails)");
        }
      } catch (error) {
        console.error("Error submitting KYC:", error);

        if (error.response?.status === 401) {
          await logout();
          return;
        }

        setErrors({
          submit:
            error.response?.data?.error ||
            "Failed to submit KYC details. Please try again.",
        });
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={40}
        className="bg-white"
      >
        <Progress value={41} className="web:w-[60%]" />
        <View className="px-4 py-4 border-b border-gray-200">
          <Text className="text-2xl font-semibold text-gray-800">
            {t("KYC Details")}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {t("Please provide your KYC information")}
          </Text>
        </View>
        <View className="flex-1 px-2 pb-0">
          <ScrollView
            className="flex-1 px-4"
            persistentScrollbar={true}
            showsVerticalScrollIndicator={true}
          >
            {inputFields.map(
              ({
                label,
                key,
                placeholder,
                keyboardType,
                multiline,
                numberOfLines,
                style,
                textAlignVertical,
                maxLength,
              }) => (
                <View className="mb-2" key={key}>
                  <Label nativeID={key} className="mb-1 text-lg font-semibold">
                    {t(label)}
                  </Label>
                  <Input
                    className="p-2 rounded"
                    placeholder={placeholder}
                    value={formData[key]?.toString() || ""}
                    onChangeText={(value) => handleChange(key, value)}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    style={{
                      ...style,
                      height: multiline ? 80 : 45,
                      textAlignVertical: multiline ? "top" : "center",
                    }}
                    maxLength={maxLength}
                    textAlignVertical={textAlignVertical}
                    aria-labelledby={key}
                    aria-errormessage={`${key}Error`}
                  />
                  {errors[key] && (
                    <Text className="text-red-500 mt-1">{t(errors[key])}</Text>
                  )}
                </View>
              )
            )}

            {errors.submit && (
              <Text className="text-red-500 mb-2">{t(errors.submit)}</Text>
            )}

            <View className="m-1 flex items-center flex-row">
              <Checkbox
                checked={checked}
                onCheckedChange={setChecked}
                className={`${checked ? "bg-blue-500" : "bg-white"} p-1`}
              />
              <Text className="ml-2">
                {t("I verify and confirm that all details are correct.")}
              </Text>
            </View>
            {checkboxError && (
              <Text className="text-red-500 mb-2">{t(checkboxError)}</Text>
            )}

            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.7}
              disabled={!checked}
              className={`mt-4 mb-8 h-14 rounded-lg ${
                !checked ? "bg-blue-500 opacity-50" : "bg-blue-500"
              } justify-center`}
            >
              <Text className="text-white font-semibold text-xl text-center">
                {t("Submit")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default KYCForm;
