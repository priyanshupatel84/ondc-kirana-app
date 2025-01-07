import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Login = () => {
  const router = useRouter();
  const { t } = useTranslation(); // Initialize translation hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onChangeEmail = (text) => {
    setEmail(text);
    setEmailError(""); // Reset error message on change
  };

  const onChangePassword = (text) => {
    setPassword(text);
    setPasswordError(""); // Reset error message on change
  };

  const validateForm = () => {
    let isValid = true;
    if (!email.includes("@")) {
      setEmailError(t("Please enter a valid email")); // Use translation
      isValid = false;
    }
    if (password.length < 6) {
      setPasswordError(t("Password must be at least 6 characters long")); // Use translation
      isValid = false;
    }
    return isValid;
  };

  const onSubmit = () => {
    if (validateForm()) {
      console.log("Login successful");
      router.push("/kyc/kycWrapper");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4 w-full">
      <View>
        <Image
          source={require("../../assets/images/ONDC-logo.png")}
          style={{ width: 300, height: 250 }}
        />
      </View>
      <Text className="text-3xl my-5 font-semibold">{t("Login")}</Text>
      <View className="mb-4 w-full px-4">
        <Label nativeID="email" className="mb-2 text-lg font-semibold">
          {t("Email")}
        </Label>
        <Input
          className="w-full p-2 "
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
          className="w-full p-2 "
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
          <Text className="text-white font-semibold text-xl">{t("Login")}</Text>
        </Button>
        <Text className="mt-4 text-center">
          {t("Don't have an account? Click on Register")}
        </Text>
        <Button
          size="lg"
          variant="destructive"
          onPress={() => router.push("/register")}
          className="mt-2 bg-gray-200 active:bg-blue-100 border border-black"
        >
          <Text className="font-semibold text-xl">{t("Register")}</Text>
        </Button>
      </View>
    </View>
  );
};

export default Login;
