import React from "react";
import { View, Text } from "react-native";
import { Switch } from "~/components/ui/switch";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const ProductSettings = React.forwardRef(
  ({ formData, onChange, errors, fieldRefs, t }, ref) => {
    return (
      <View ref={ref} className="rounded-xl p-5 mb-3 m-2 bg-white">
        <Text className="text-xl font-semibold mb-3 p-1 rounded-lg text-center bg-blue-500 text-white">
          {t("Product Settings")}
        </Text>

        <View className="space-y-4">
          {/* Stock Management */}
          <View className="mb-4">
            <Label
              htmlFor="stock"
              className="text-base font-medium text-gray-700 mb-1"
            >
              {t("Available Stock")}*
            </Label>
            <Input
              id="stock"
              className="p-2 bg-gray-50 rounded-lg min-h-[44px]"
              value={formData.stock}
              onChangeText={(text) => onChange("stock", text)}
              keyboardType="numeric"
              placeholder="Enter available stock quantity"
              ref={(ref) => (fieldRefs.current["stock"] = ref)}
            />
            {errors?.stock && (
              <Text className="text-red-500 text-sm mt-1">
                {t(errors.stock)}
              </Text>
            )}
          </View>

          {/* Returnable Setting */}
          <View className="flex flex-row items-center justify-between m-1">
            <Label
              htmlFor="ReturnableSetting"
              className="text-base font-medium text-gray-700"
            >
              {t("Product is Returnable")}
            </Label>
            <Switch
              id="ReturnableSetting"
              checked={formData.ReturnableSetting}
              onCheckedChange={(checked) =>
                onChange("ReturnableSetting", checked)
              }
              ref={(ref) => (fieldRefs.current["ReturnableSetting"] = ref)}
            />
          </View>

          {/* Return Window */}
          {formData.ReturnableSetting && (
            <View className="mt-2">
              <Label
                htmlFor="returnWindow"
                className="text-base font-medium text-gray-700 mb-1"
              >
                {t("Return Window (in days)")}
              </Label>
              <Input
                id="returnWindow"
                className="p-2 bg-gray-50 rounded-lg min-h-[44px]"
                value={formData.returnWindow}
                onChangeText={(text) => onChange("returnWindow", text)}
                keyboardType="numeric"
                placeholder="Enter number of days for return window"
                ref={(ref) => (fieldRefs.current["returnWindow"] = ref)}
              />
              {errors?.returnWindow && (
                <Text className="text-red-500 text-sm mt-1">
                  {t(errors.returnWindow)}
                </Text>
              )}
            </View>
          )}

          {/* Cancellable Setting */}
          <View className="flex flex-row items-center justify-between m-1">
            <Label
              htmlFor="CancellableSetting"
              className="text-base font-medium text-gray-700"
            >
              {t("Product is Cancellable")}
            </Label>
            <Switch
              id="CancellableSetting"
              checked={formData.CancellableSetting}
              onCheckedChange={(checked) =>
                onChange("CancellableSetting", checked)
              }
              ref={(ref) => (fieldRefs.current["CancellableSetting"] = ref)}
            />
          </View>

          {/* Cancellation Window */}
          {formData.CancellableSetting && (
            <View className="mt-2">
              <Label
                htmlFor="cancellationWindow"
                className="text-base font-medium text-gray-700 mb-1"
              >
                {t("Cancellation Window (in days)")}
              </Label>
              <Input
                id="cancellationWindow"
                className="p-2 bg-gray-50 rounded-lg min-h-[44px]"
                value={formData.cancellationWindow}
                onChangeText={(text) => onChange("cancellationWindow", text)}
                keyboardType="numeric"
                placeholder="Enter number of days for cancellation window"
                ref={(ref) => (fieldRefs.current["cancellationWindow"] = ref)}
              />
              {errors?.cancellationWindow && (
                <Text className="text-red-500 text-sm mt-1">
                  {t(errors.cancellationWindow)}
                </Text>
              )}
            </View>
          )}

          {/* Cash on Delivery Setting */}
          <View className="flex flex-row items-center justify-between pt-2 border-t border-gray-200">
            <Label
              htmlFor="CashOnDeliverySetting"
              className="text-base font-medium text-gray-700"
            >
              {t("Cash on Delivery Available")}
            </Label>
            <Switch
              id="CashOnDeliverySetting"
              checked={formData.CashOnDeliverySetting}
              onCheckedChange={(checked) =>
                onChange("CashOnDeliverySetting", checked)
              }
              ref={(ref) => (fieldRefs.current["CashOnDeliverySetting"] = ref)}
            />
          </View>
        </View>
      </View>
    );
  }
);

ProductSettings.displayName = "ProductSettings";

export default ProductSettings;
