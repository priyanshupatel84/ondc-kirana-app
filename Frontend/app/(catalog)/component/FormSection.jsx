// labelMappings.js
export const fieldLabels = {
  // Required Fields
  productCode: "Product Code",
  productName: "Product Name",
  shortDescription: "Short Description",
  weight: "Weight",
  manufacturerName: "Manufacturer Name",
  mrp: "MRP in (₹)",
  sellingPrice: "Selling Price in (₹)",

  // Optional Fields
  longDescription: "Long Description",
  countryOfOrigin: "Country of Origin",
  gstPercentage: "GST Percentage",
  length: "Length",
  breadth: "Breadth",
  height: "Height",
  instructions: "Instructions",
  commodityName: "Commodity Name",
  manufactureDate: "Manufacture Date",
  uomUnit: "Unit of Measurement Unit",
  uomValue: "Unit of Measurement Value",
  quantity: "Quantity",
  storageInstructions: "Storage Instructions",
  allergenInfo: "Allergen Info",
  fssaiCertification: "FSSAI Certification",
  shelfLife: "Shelf Life",
  customerCare: "Customer Care",
};

export const placeholders = {
  productCode: "Enter unique product code (e.g., ABC123)",
  productName: "Enter product name (e.g., Organic Green Tea)",
  shortDescription: "Brief product description in 15-20 words",
  weight: "Enter product weight (e.g., 100)",
  manufacturerName: "Enter manufacturer name",
  mrp: "Enter Maximum Retail Price",
  sellingPrice: "Enter selling price",

  longDescription:
    "Detailed product description including features and benefits...",
  countryOfOrigin: "Enter country of origin (e.g., India)",
  gstPercentage: "Enter GST percentage (e.g., 18)",
  length: "Enter length in cm",
  breadth: "Enter breadth in cm",
  height: "Enter height in cm",
  instructions: "Enter usage or preparation instructions...",
  commodityName: "Enter commodity name",
  manufactureDate: "Enter manufacture date (DD/MM/YYYY)",
  uomUnit: "Enter unit (e.g., g, kg, ml)",
  uomValue: "Enter value (e.g., 100)",
  quantity: "Enter quantity in pack",
  storageInstructions: "Enter storage and handling instructions...",
  allergenInfo: "Enter allergen information if any...",
  fssaiCertification: "Enter FSSAI license number",
  shelfLife: "Enter product shelf life",
  customerCare: "Enter customer care details...",
};

// FormSection.jsx
import React from "react";
import { View } from "react-native";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Text } from "~/components/ui/text";
import { Label } from "~/components/ui/label";

export const FormField = React.forwardRef(
  ({ field, value, isRequired, error, onChange }, ref) => {
    const isMultilineField =
      field === "longDescription" ||
      field === "customerCare" ||
      field === "instructions" ||
      field === "storageInstructions" ||
      field === "allergenInfo";
    field === "shortDescription";

    const displayValue = typeof value === "number" ? value.toString() : value;

    return (
      <View ref={ref} key={field} className="mb-3">
        <Label
          className={`text-base font-medium text-gray-700 mb-1`}
          style={{ lineHeight: 24 }}
        >
          {fieldLabels[field]}
          {isRequired && <Text className="text-red-500 ml-0.5">*</Text>}
        </Label>

        {isMultilineField ? (
          <Textarea
            className="min-h-[100px] bg-gray-50 border border-gray-200 rounded-lg p-2 text-base text-gray-900"
            placeholder={placeholders[field]}
            value={displayValue}
            onChangeText={(text) => onChange(field, text)}
            rows={4}
          />
        ) : (
          <Input
            className="p-2 bg-gray-50 rounded-lg min-h-[44px]"
            placeholder={placeholders[field]}
            value={displayValue}
            onChangeText={(text) => {
              const processedValue =
                field === "uomValue" ? parseFloat(text) || text : text;
              onChange(field, processedValue);
            }}
            textAlignVertical="center"
            keyboardType={
              field === "uomValue" ||
              field === "mrp" ||
              field === "sellingPrice" ||
              field === "gstPercentage" ||
              field === "length" ||
              field === "breadth" ||
              field === "height" ||
              field === "quantity" ||
              field === "returnWindow" ||
              field === "cancellationWindow"
                ? "numeric"
                : "default"
            }
          />
        )}
        {error && (
          <Text className="text-red-500 text-sm mt-2 px-1">{error}</Text>
        )}
      </View>
    );
  }
);

FormField.displayName = "FormField";

const FormSection = React.forwardRef(
  (
    { title, fields, formData, requiredFields, errors, onChange, fieldRefs },
    ref
  ) => {
    return (
      <View ref={ref} className="rounded-xl p-5 m-2 bg-white">
        <Text className="text-xl font-semibold mb-3 p-1 rounded-lg text-center bg-blue-500 text-white">
          {title}
        </Text>
        <View>
          {fields.map((field) => (
            <FormField
              key={field}
              ref={(fieldRef) => {
                if (fieldRefs && typeof fieldRefs.current === "object") {
                  fieldRefs.current[field] = fieldRef;
                }
              }}
              field={field}
              value={formData[field]}
              isRequired={requiredFields.includes(field)}
              error={errors[field]}
              onChange={onChange}
            />
          ))}
        </View>
      </View>
    );
  }
);

FormSection.displayName = "FormSection";

export default FormSection;
