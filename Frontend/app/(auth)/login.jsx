import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

const Login = () => {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      console.log(user);
      if (!user.isDocumentVerified) {
        router.replace("/(docVerification)/docVerificationIndex");
      } else if (!user.isShopSetuped) {
        router.replace("/(shopDetails)/shopDetailsIndex");
      } else {
        router.replace("/(tabs)/home");
      }
    }
  }, [user, loading]);
  const handleInputChange = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({ ...formErrors, [`${field}Error`]: "", loginError: "" });
  };

  const onSubmit = async () => {
    setLoadingState(true);
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, formData);

      if (response.status === 200) {
        await login(response.data.user, response.data.token);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        setFormErrors({
          loginError: t("An unexpected error occurred. Please try again."),
        });
      }
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 items-center justify-center bg-white p-4 w-full"
    >
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
          className="w-full p-2"
          placeholder="Email"
          value={formData.email}
          onChangeText={handleInputChange("email")}
          aria-labelledby="email"
          aria-errormessage="emailError"
        />
        {formErrors.emailError && (
          <Text className="text-red-500">{t(formErrors.emailError)}</Text>
        )}
      </View>
      <View className="mb-4 w-full px-4">
        <Label nativeID="password" className="mb-2 text-lg font-semibold">
          {t("Password")}
        </Label>
        <Input
          className="w-full p-2"
          placeholder="Password"
          value={formData.password}
          onChangeText={handleInputChange("password")}
          aria-labelledby="password"
          aria-errormessage="passwordError"
          secureTextEntry
        />
        {formErrors.passwordError && (
          <Text className="text-red-500">{t(formErrors.passwordError)}</Text>
        )}
      </View>
      {formErrors.loginError && (
        <Text className="text-red-500">{t(formErrors.loginError)}</Text>
      )}
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
    </KeyboardAvoidingView>
  );
};

export default Login;
