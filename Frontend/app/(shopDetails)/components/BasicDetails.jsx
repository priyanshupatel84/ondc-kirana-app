import React from "react";
import { View, Text } from "react-native";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useTranslation } from "react-i18next";

const BasicDetails = ({ formData, errors, handleChange, msg }) => {
  const { t } = useTranslation();
  return (
    <>
      {Object.keys(msg.formLabels).map((key) => {
        if (
          [
            "liveShopStatus",
            "shopHours",
            "openingTime",
            "closingTime",
            "deliveryRadius",
            "productCategories",
          ].includes(key)
        ) {
          return null;
        }
        return (
          <View className="mb-3" key={key}>
            <Label nativeID={key} className="mb-1 text-lg font-semibold">
              {t(msg.formLabels[key])}
            </Label>
            <Input
              className="p-2 rounded"
              placeholder={msg.formPlaceholder[key]}
              value={formData[key]}
              onChangeText={(value) => handleChange(key, value)}
              aria-labelledby={key}
            />
            {errors[key] && (
              <Text className="text-red-500">{t(errors[key])}</Text>
            )}
          </View>
        );
      })}
    </>
  );
};

export default BasicDetails;
