import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";

const Grocery = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    shortDescription: "",
    longDescription: "",
    countryOfOrigin: "",
    gstPercentage: "",
    maxAllowedQuantity: "",
    length: "",
    breadth: "",
    height: "",
    weight: "",
    returnWindow: "",
    manufacturerName: "",
    manufacturedDate: "",
    instructions: "",
    foodCategory: "",
    returnable: "",
    cancellable: "",
    cashOnDelivery: "",
    packerName: "",
    packerAddress: "",
    commodityName: "",
    manufactureDate: "",
    fulfilmentOption: "",
    uom: "",
    uomValue: "",
    mrp: "",
    purchasePrice: "",
    quantity: "",
    sku: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    // Validate the form data
    // Assume validateProductForm is a function that validates the formData
    // and returns an object with isValid and errors properties
    const { isValid, errors } = validateProductForm(formData);
    setErrors(errors);

    if (isValid) {
      console.log("Product Details Submitted", formData);
      router.push("/success");
    }
  };

  return (
    <View className="items-center justify-center p-4 w-full">
      <View className="h-[600px] w-full p-2">
        <Text className="text-3xl my-3 font-semibold text-center">
          Product Details
        </Text>
        <ScrollView className="p-3" persistentScrollbar={true}>
          {Object.entries(formData).map(([field, value]) => (
            <View key={field} className="mb-3">
              <Label nativeID={field} className="mb-1 text-lg font-semibold">
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </Label>
              <Input
                className="p-2"
                placeholder={`Enter ${field
                  .replace(/([A-Z])/g, " $1")
                  .toLowerCase()}`}
                value={value}
                onChangeText={(text) => handleChange(field, text)}
                aria-labelledby={field}
                aria-errormessage={`${field}Error`}
              />
              {errors[field] ? (
                <Text className="text-red-500">{errors[field]}</Text>
              ) : null}
            </View>
          ))}
        </ScrollView>
      </View>
      <Button
        size="lg"
        variant="destructive"
        onPress={handleSubmit}
        className="mt-4 w-[320px] bg-blue-500 active:bg-blue-400"
      >
        <Text className="text-white font-semibold text-xl">Submit</Text>
      </Button>
    </View>
  );
};

export default Grocery;

// Assume validateProductForm is defined elsewhere and handles validation logic
