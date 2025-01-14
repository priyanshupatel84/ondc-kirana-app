import React from "react";
import { View } from "react-native";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

const ShopHours = ({
  openingTime,
  closingTime,
  onChangeOpening,
  onChangeClosing,
  msg,
}) => (
  <View className="mb-4 border border-gray-400 p-3 rounded-xl">
    <Label className="text-lg font-semibold mb-2">
      {msg.formLabels.shopHours}
    </Label>
    <View className="flex-row justify-between">
      <View className="w-[48%]">
        <Label className="mb-1">{msg.formLabels.openingTime}</Label>
        <Input
          className="border border-gray-400 p-3 rounded-xl"
          type="time"
          value={openingTime}
          onChangeText={onChangeOpening}
          placeholder={msg.formPlaceholder.openingTime}
        />
      </View>
      <View className="w-[48%]">
        <Label className="mb-1">{msg.formLabels.closingTime}</Label>
        <Input
          className="border border-gray-400 p-3 rounded-xl"
          type="time"
          value={closingTime}
          onChangeText={onChangeClosing}
          placeholder={msg.formPlaceholder.closingTime}
        />
      </View>
    </View>
  </View>
);

export default ShopHours;
