import React from "react";
import { View } from "react-native";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

const DefaultSettings = ({ formData, handleChange, t }) => (
  <View className="flex-row justify-between ">
    <View className="w-[48%] mb-3 border border-gray-400 p-3 rounded-xl p-3">
      <Label
        nativeID="defaultCancellableSetting"
        className="mb-1 text-lg font-semibold"
      >
        {t("Default Cancellable")}
      </Label>
      <Switch
        checked={formData.defaultCancellableSetting}
        onCheckedChange={(value) =>
          handleChange("defaultCancellableSetting", value)
        }
        nativeID="defaultCancellableSetting"
      />
    </View>

    <View className="w-[48%] mb-3 border border-gray-400 p-3 rounded-xl">
      <Label
        nativeID="defaultReturnableSetting"
        className="mb-1 text-lg font-semibold"
      >
        {t("Default Returnable")}
      </Label>
      <Switch
        checked={formData.defaultReturnableSetting}
        onCheckedChange={(value) =>
          handleChange("defaultReturnableSetting", value)
        }
        nativeID="defaultReturnableSetting"
      />
    </View>
  </View>
);

export default DefaultSettings;
