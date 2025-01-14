import React from "react";
import { View, Text } from "react-native";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

const ShopStatus = ({ isLiveShop, onChange, msg }) => (
  <View className="mb-4 border border-gray-400 p-3 rounded-xl">
    <View className="flex-row justify-between items-center">
      <Label className="text-lg font-semibold">
        {msg.formLabels.liveShopStatus}
      </Label>
      <Switch checked={isLiveShop} onCheckedChange={onChange} />
    </View>
    <Text className="text-sm text-gray-500 mt-1">
      {isLiveShop ? msg.shopStatus.live : msg.shopStatus.offline}
    </Text>
  </View>
);

export default ShopStatus;
