import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const STATUS_COLORS = {
  verified: "bg-green-300",
  notVerified: "bg-red-300",
  pending: "bg-yellow-100",
};

const STATUS_MESSAGES = {
  verified: "Verified",
  notVerified: "Not Verified",
  pending: "Pending",
};

const DocumentItem = ({ icon, title, onPress, status, imageUri }) => {
  const getStatusColor = () => {
    if (status === true) return STATUS_COLORS.verified;
    if (status === false) return STATUS_COLORS.notVerified;
    return STATUS_COLORS.pending;
  };

  const getStatusIcon = () => {
    if (status === true) return "check";
    if (status === false) return "times";
    return "hourglass-half";
  };

  const getStatusText = () => {
    if (status === true) return STATUS_MESSAGES.verified;
    if (status === false) return STATUS_MESSAGES.notVerified;
    return STATUS_MESSAGES.pending;
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.4}
        className={`w-48 h-32 my-1 flex flex-col items-center justify-center rounded-xl shadow-lg py-1 border-[1px] border-blue-500 ${getStatusColor()}`}
        onPress={onPress}
      >
        <View className="self-center flex items-center justify-center p-2 rounded-xl">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: 55,
                height: 50,
                aspectRatio: 2.2,
                resizeMode: "contain",
              }}
            />
          ) : (
            <FontAwesome
              name={icon}
              size={38}
              style={{ color: "rgb(0 110 177)", opacity: 1 }}
            />
          )}
        </View>

        <View>
          <Text
            className="text-center text-lg font-bold leading-tight text-{#0076CE}"
            style={{ color: "rgb(0 110 177)", opacity: 1 }}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>

      <View className="flex flex-row items-center justify-center">
        <FontAwesome
          name={getStatusIcon()}
          size={20}
          color={
            status === true ? "green" : status === false ? "red" : "orange"
          }
        />
        <Text
          className={`text-center text-lg font-semibold ml-2 ${
            status === true
              ? "text-green-600"
              : status === false
              ? "text-red-500"
              : "text-yellow-600"
          }`}
        >
          {getStatusText()}
        </Text>
      </View>
    </View>
  );
};

export default DocumentItem;
