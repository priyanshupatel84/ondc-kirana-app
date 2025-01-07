import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Register = () => {
  const router = useRouter();
  const { t } = useTranslation(); // Initialize translation hook
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onChangeName = (text) => {
    setName(text);
    setNameError("");
  };

  const onChangeEmail = (text) => {
    setEmail(text);
    setEmailError("");
  };
  const onChangeMobile = (text) => {
    setMobile(text);
    setMobileError("");
  };

  const onChangePassword = (text) => {
    setPassword(text);
    setPasswordError("");
  };

  const validateForm = () => {
    let isValid = true;

    // Name validation
    if (name.trim() === "") {
      setNameError(t("Name is required"));
      isValid = false;
    }

    // Email validation
    if (!email.includes("@")) {
      setEmailError(t("Please enter a valid email"));
    }

    // Mobile validation (basic validation for 10-digit number)
    if (mobile.trim().length !== 10 || isNaN(mobile)) {
      setMobileError(t("Please enter a valid 10-digit mobile number"));
      isValid = false;
    }

    // Password validation
    if (password.length < 6) {
      setPasswordError(t("Password must be at least 6 characters long"));
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = () => {
    if (validateForm()) {
      router.push("auth/login");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4 w-full">
      <View>
        <Image
          source={require("../../assets/images/ONDC-only-logo.png")}
          style={{ width: 300, height: 100 }}
        />
      </View>
      <Text className="text-3xl my-5 font-semibold">{t("Register")}</Text>

      <View className="mb-4 w-full px-4">
        <Label nativeID="name" className="mb-2 text-lg font-semibold">
          {t("Full Name")}
        </Label>
        <Input
          className="w-full p-2"
          placeholder="Full Name"
          value={name}
          onChangeText={onChangeName}
          aria-labelledby="name"
          aria-errormessage="nameError"
        />
        {nameError ? <Text className="text-red-500">{nameError}</Text> : null}
      </View>

      <View className="mb-4 w-full px-4">
        <Label nativeID="mobile" className="mb-2 text-lg font-semibold">
          {t("Mobile Number")}
        </Label>
        <Input
          className="w-full p-2"
          placeholder="Mobile Number"
          value={mobile}
          onChangeText={onChangeMobile}
          aria-labelledby="mobile"
          aria-errormessage="mobileError"
          keyboardType="numeric"
        />
        {mobileError ? (
          <Text className="text-red-500">{mobileError}</Text>
        ) : null}
      </View>

      <View className="mb-4 w-full px-4">
        <Label nativeID="email" className="mb-2 text-lg font-semibold">
          {t("Email")}
        </Label>
        <Input
          className="w-full p-2"
          placeholder="Email"
          value={email}
          onChangeText={onChangeEmail}
          aria-labelledby="email"
          aria-errormessage="emailError"
        />
        {emailError ? <Text className="text-red-500">{emailError}</Text> : null}
      </View>

      <View className="mb-4 w-full px-4">
        <Label nativeID="password" className="mb-2 text-lg font-semibold">
          {t("Password")}
        </Label>
        <Input
          className="w-full p-2"
          placeholder="Password"
          value={password}
          onChangeText={onChangePassword}
          aria-labelledby="password"
          aria-errormessage="passwordError"
          secureTextEntry
        />
        {passwordError ? (
          <Text className="text-red-500">{passwordError}</Text>
        ) : null}
      </View>

      <View className="mb-4 w-full px-4">
        <Button
          size="lg"
          variant="destructive"
          onPress={onSubmit}
          className="mt-4 bg-blue-500 active:bg-blue-400"
        >
          <Text className="text-white font-semibold text-xl">
            {t("Register")}
          </Text>
        </Button>
        <View className="justify-center flex-row m-1 items-center">
          <Text>{t("Already have an account?")}</Text>
          <Button
            size="sm"
            className="active:bg-gray-200 p-1 m-1"
            onPress={() => router.push("/login")}
          >
            <Text className="text-blue-500 font-semibold">{t("Login")}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Register;
