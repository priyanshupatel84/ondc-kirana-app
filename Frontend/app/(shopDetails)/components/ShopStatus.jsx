import React from "react";
import { View, Text } from "react-native";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useTranslation } from "react-i18next";

const ShopStatus = ({ isLiveShop, onChange, msg }) => {
  const { t } = useTranslation();
  return (
    <View className=" border border-gray-400 p-3 rounded-xl">
      <View className="flex-row justify-between items-center">
        <Label className="text-lg font-semibold">
          {t(msg.formLabels.liveShopStatus)}
        </Label>
        <Switch checked={isLiveShop} onCheckedChange={onChange} />
      </View>
      <Text className="text text-gray-500 mt-1">
        {isLiveShop ? t(msg.shopStatus.live) : t(msg.shopStatus.offline)}
      </Text>
    </View>
  );
};

export default ShopStatus;
