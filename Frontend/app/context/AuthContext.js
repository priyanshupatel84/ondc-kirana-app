import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [kyc, setKyc] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData, userToken) => {
    try {
      setLoading(true);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", userToken);
      setUser(userData);
      setToken(userToken);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(
          `${API_URL}/api/users/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      await AsyncStorage.multiRemove(["user", "token"]);

      setUser(null);

      setToken(null);
      setKyc(null);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error during logout:", error);
      await AsyncStorage.multiRemove(["user", "token"]);
      setUser(null);

      setToken(null);
      setKyc(null);
      router.replace("/(auth)/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        kyc,
        setKyc,
        login,
        logout,
        setUser,

        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
