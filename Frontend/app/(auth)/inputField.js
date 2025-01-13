import React from "react";
import { View, Text } from "react-native";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
const InputField = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
}) => (
  <View className="mb-4 w-full px-4">
    <Label nativeID={label} className="mb-2 text-lg font-semibold">
      {label}
    </Label>
    <Input
      className="w-full p-2"
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      aria-labelledby={label}
      aria-errormessage={`${label}Error`}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
    {error && <Text className="text-red-500">{error}</Text>}
  </View>
);

export default InputField;
