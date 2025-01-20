import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const HelpModal = ({ visible, onClose }) => {
  const { t } = useTranslation();
  if (!visible) return null;

  return (
    <View className="absolute inset-0 justify-end items-center bg-black opacity-90">
      <View className="w-full p-4 bg-white rounded-t-lg shadow-lg bg-gray-200 border opacity-100">
        <View className="flex flex-row justify-between items-center px-2">
          <Text className="text-2xl font-bold">{t("Help")}</Text>
          <TouchableOpacity className="py-2" onPress={onClose}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Text className="text-lg mt-6 font-semibold">
          {t("PAN Card & GST")}
        </Text>

        <Text className="text-lg my-4">
          • {t("For creating a PAN card, you can visit the official website:")}
          <Text
            style={{ color: "blue" }}
            onPress={() => Linking.openURL("https://www.pan.utiitsl.com/PAN/")}
          >
            {t("PAN Card Application Portal")}
          </Text>
          .
        </Text>

        <Text className="text-lg my-4">
          •{" "}
          {t(
            "For creating a GSTIN certificate, you can visit the official website:"
          )}
          <Text
            style={{ color: "blue" }}
            onPress={() => Linking.openURL("https://www.gst.gov.in/")}
          >
            {t("GST Portal")}
          </Text>
          .
        </Text>

        <Text className="text-lg my-4">
          •{" "}
          {t(
            "For creating a bank cheque, you can visit your respective bank's official website or branch."
          )}
        </Text>

        <Text className="text-lg mt-6 font-semibold">
          {t("Aadhaar Card Information")}
        </Text>

        <Text className="text-lg my-4">
          •{" "}
          {t(
            "To apply for a new Aadhaar card, visit the official UIDAI website:"
          )}
          <Text
            style={{ color: "blue" }}
            onPress={() =>
              Linking.openURL(
                "https://uidai.gov.in/my-aadhaar/get-aadhaar.html"
              )
            }
          >
            {t("UIDAI Aadhaar Portal")}
          </Text>
        </Text>

        <Text className="text-lg my-4">
          • {t("To find the nearest Aadhaar enrollment center:")}
          <Text
            style={{ color: "blue" }}
            onPress={() =>
              Linking.openURL("https://appointments.uidai.gov.in/easearch.aspx")
            }
          >
            {t("Enrollment Center Locator")}
          </Text>
        </Text>

        <Text className="text-lg my-4">
          • {t("To update your existing Aadhaar information:")}
          <Text
            style={{ color: "blue" }}
            onPress={() => Linking.openURL("https://ssup.uidai.gov.in/ssup/")}
          >
            {t("Self Service Update Portal")}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default HelpModal;
