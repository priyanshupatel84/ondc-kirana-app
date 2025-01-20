import React from "react";
import { View } from "react-native";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Input } from "~/components/ui/input";
import { useTranslation } from "react-i18next";

const RadioGroupItemWithLabel = ({ value, label, onLabelPress }) => {
  const { t } = useTranslation();
  return (
    <View className="flex-row gap-2 items-center">
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {t(label)}
      </Label>
    </View>
  );
};

const LocationAvailability = ({
  locationAvailability,
  city,
  customRadius,
  onLocationChange,
  onCityChange,
  onRadiusChange,
  msg,
  t,
}) => (
  <View className="mb-3">
    <Label className="mb-1 text-lg font-semibold">
      {t("Location Availability")}
    </Label>
    <View className="border border-gray-400 p-3 rounded-xl">
      <RadioGroup
        value={locationAvailability}
        onValueChange={onLocationChange}
        className="gap-3"
      >
        {msg.locationOptions.map((option) => (
          <RadioGroupItemWithLabel
            key={option.value}
            value={option.value}
            label={option.label}
            onLabelPress={() => onLocationChange(option.value)}
          />
        ))}
      </RadioGroup>

      {locationAvailability === "City" && (
        <View className="mt-3 border-t border-gray-200 pt-3">
          <Label className="mb-1 text-base">{t("City Name")}</Label>
          <Input
            className="p-2 rounded"
            placeholder={msg.formPlaceholder.city}
            value={city}
            onChangeText={onCityChange}
            aria-labelledby="city"
          />
        </View>
      )}

      {locationAvailability === "Custom" && (
        <View className="mt-3 border-t border-gray-200 pt-3">
          <Label className="mb-1 text-base">
            {t(msg.formLabels.deliveryRadius)}
          </Label>
          <Input
            className="p-2 rounded mt-1"
            placeholder={msg.formPlaceholder.deliveryRadius}
            value={customRadius}
            onChangeText={onRadiusChange}
            keyboardType="numeric"
            aria-labelledby="customRadius"
          />
        </View>
      )}
    </View>
  </View>
);

export default LocationAvailability;
