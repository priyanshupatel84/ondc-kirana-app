import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import axios from "axios";
import messages from "./texts";
import InputField from "./inputField";
import SuccessPopup from "../myComponent/successPopup";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const Register = () => {
  const { t } = useTranslation();
  const msg = messages(t);
  const router = useRouter();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    nameError: "",
    emailError: "",
    mobileError: "",
    passwordError: "",
    registerError: "",
  });

  const isEnglishInput = (text) =>
    /^[A-Za-z0-9\s@#%^&*()_+=[\]{}|\\;:'",.<>/?~`!$-]*$/.test(text);

  const handleInputChange = (field) => (text) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: text,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [`${field}Error`]: "",
      registerError: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (formData.name.trim() === "") {
      errors.nameError = msg.inputValidationErrors.nameRequired;
      isValid = false;
    } else if (!isEnglishInput(formData.name)) {
      errors.nameError = msg.fieldErrors.nameNotInEnglish;
      isValid = false;
    }

    if (formData.email.trim() === "" || !formData.email.includes("@")) {
      errors.emailError = msg.inputValidationErrors.invalidEmail;
      isValid = false;
    } else if (!isEnglishInput(formData.email)) {
      errors.emailError = msg.fieldErrors.emailNotInEnglish;
      isValid = false;
    }

    if (formData.mobile.trim().length !== 10 || isNaN(formData.mobile)) {
      errors.mobileError = msg.inputValidationErrors.invalidMobile;
      isValid = false;
    } else if (!isEnglishInput(formData.mobile)) {
      errors.mobileError = msg.fieldErrors.mobileNotInEnglish;
      isValid = false;
    }

    if (formData.password.length < 8) {
      errors.passwordError = msg.inputValidationErrors.weakPassword;
      isValid = false;
    } else if (!isEnglishInput(formData.password)) {
      errors.passwordError = msg.fieldErrors.passwordNotInEnglish;
      isValid = false;
    }

    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    return isValid;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post(`${API_URL}/api/users/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mob_no: formData.mobile,
        });

        if (response.status === 201) {
          setShowSuccessPopup(true);
        }
      } catch (error) {
        if (
          error.response?.data?.error === "User already exists with this email."
        ) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            registerError: msg.errorMessages.userAlreadyExists,
          }));
        } else if (error.response?.data?.errors) {
          const errorData = error.response.data.errors;
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            nameError: errorData.nameError || "",
            mobileError: errorData.mobileError || "",
            emailError: errorData.emailError || "",
            passwordError: errorData.passwordError || "",
            registerError: errorData.photoError || "",
          }));
        } else if (error.response?.status === 500) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            registerError: msg.inputValidationErrors.internalServerError,
          }));
        } else {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            registerError: msg.inputValidationErrors.unexpectedError,
          }));
        }
      }
    }
  };

  const handlePopupClose = () => {
    setShowSuccessPopup(false);
    router.replace("/login");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4 w-full">
      <SuccessPopup
        visible={showSuccessPopup}
        message={msg.successMessages.registrationSuccess}
        onClose={handlePopupClose}
        duration={1500}
      />

      <View>
        <Image
          source={require("../../assets/images/ONDC-only-logo.png")}
          style={{ width: 300, height: 100 }}
        />
      </View>
      <Text className="text-3xl my-5 font-semibold">
        {msg.formLabels.register}
      </Text>

      <InputField
        label={msg.formLabels.name}
        value={formData.name}
        onChange={handleInputChange("name")}
        error={formErrors.nameError}
        placeholder={msg.formPlaceholder.name}
      />

      <InputField
        label={msg.formLabels.mobile}
        value={formData.mobile}
        onChange={handleInputChange("mobile")}
        error={formErrors.mobileError}
        placeholder={msg.formPlaceholder.mobile}
        keyboardType="numeric"
      />

      <InputField
        label={msg.formLabels.email}
        value={formData.email}
        onChange={handleInputChange("email")}
        error={formErrors.emailError}
        placeholder={msg.formPlaceholder.email}
      />

      <InputField
        label={msg.formLabels.password}
        value={formData.password}
        onChange={handleInputChange("password")}
        error={formErrors.passwordError}
        placeholder={msg.formPlaceholder.password}
        secureTextEntry
      />

      {formErrors.registerError && (
        <Text className="text-red-500">{formErrors.registerError}</Text>
      )}

      <View className="mb-4 w-full px-4">
        <Button
          size="lg"
          variant="destructive"
          onPress={onSubmit}
          className="mt-4 bg-blue-500 active:bg-blue-400"
        >
          <Text className="text-white font-semibold text-xl">
            {msg.formLabels.register}
          </Text>
        </Button>

        <View className="justify-center flex-row m-1 items-center">
          <Text>{msg.formLabels.alreadyHaveAccount}</Text>
          <Button
            size="sm"
            className="active:bg-gray-200 p-1 m-1"
            onPress={() => router.push("/login")}
          >
            <Text className="text-blue-500 font-semibold">
              {msg.formLabels.login}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Register;
