// (tabs)/catalog/product.jsx
import React, { useState, useRef } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Button } from "~/components/ui/button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { pickImageWithEdit } from "../../utils/imagePicker";
import { convertToBase64 } from "../../utils/imageConversion";
import { PRODUCT_INFO_EXTRACTION_PROMPT } from "./component/prompt";
import {
  callGoogleVisionAsync,
  analyzeTextWithGemini,
} from "./component/apiCall";
import { useFormValidation, ERROR_MESSAGES } from "./component/validationUtils";

import LoadingOverlay from "./component/LoadingOverlay";
import ImageUploadSection from "./component/ImageUploadSection";
import FormSection from "./component/FormSection";
import { useTranslation } from "react-i18next";
import ProductSettings from "./component/productSettings";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Product = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const { t } = useTranslation();
  const scrollViewRef = useRef(null);
  const fieldRefs = useRef({});
  const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;
  const { token } = useAuth();

  // Loading state
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Form fields
  const requiredFields = [
    "productCode",
    "productName",
    "shortDescription",
    "weight",
    "manufacturerName",
    "mrp",
    "sellingPrice",
  ];

  const optionalFields = [
    "longDescription",
    "countryOfOrigin",
    "gstPercentage",
    "length",
    "breadth",
    "height",
    "instructions",
    "commodityName",
    "manufactureDate",
    "uomUnit",
    "uomValue",
    "quantity",
    "storageInstructions",
    "allergenInfo",
    "fssaiCertification",
    "shelfLife",
    "customerCare",
  ];

  // State management
  const [formData, setFormData] = useState({
    ...requiredFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
    ...optionalFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
    category: category, // Store the category
    CancellableSetting: false,
    ReturnableSetting: false,
    CashOnDeliverySetting: false,
    returnWindow: "",
    cancellationWindow: "",
    stock: "",
  });

  const [errors, setErrors] = useState({});
  const [productImages, setProductImages] = useState({
    backImage: null,
  });

  // const [base64Images, setBase64Images] = useState({
  //   backImage: null,
  // });

  // Setup validation
  const { validateSingleField, validateAllFields } = useFormValidation(
    formData,
    productImages,
    setErrors,
    fieldRefs,
    scrollViewRef
  );

  // Event handlers
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    validateSingleField(field, value);
  };

  const handleBackImageProcessing = async (imageUri) => {
    try {
      setLoading(true);
      setLoadingStatus("Converting image to base64...");
      setLoadingProgress(25);

      const base64Image = await convertToBase64(imageUri);
      setLoadingStatus("Extracting text from image...");
      setLoadingProgress(50);

      const extractedText = await callGoogleVisionAsync(base64Image);
      setLoadingStatus("Analyzing product information...");
      setLoadingProgress(75);

      const completePrompt = `${PRODUCT_INFO_EXTRACTION_PROMPT}\n\nText to Analyze:\n${extractedText}`;
      const analyzedData = await analyzeTextWithGemini(completePrompt);

      setLoadingStatus("Updating form data...");
      setLoadingProgress(90);

      if (analyzedData) {
        setFormData((prev) => {
          const newData = { ...prev, ...analyzedData };
          // Validate new data
          Object.keys(analyzedData).forEach((field) => {
            validateSingleField(field, analyzedData[field]);
          });
          return newData;
        });
      }

      setLoadingProgress(100);
    } catch (error) {
      console.error("Error processing image:", error);
      setErrors((prev) => ({
        ...prev,
        imageProcessing: ERROR_MESSAGES.PROCESSING_ERROR,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async (imageKey) => {
    try {
      const imageUri = await pickImageWithEdit();
      if (imageUri) {
        setProductImages((prev) => ({
          ...prev,
          [imageKey]: imageUri,
        }));

        if (imageKey === "backImage") {
          await handleBackImageProcessing(imageUri);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setErrors((prev) => ({
        ...prev,
        imagePicker: "Error selecting image. Please try again.",
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("images", productImages);
      console.log("Product Details Submitted", formData);

      if (validateAllFields()) {
        setLoading(true);
        setLoadingStatus("Adding product...");

        const submitData = {
          ...formData,
          images: productImages,
          category: category,
        };

        console.log("Product Details Submitted", submitData);

        const response = await axios.post(
          `${API_URL}/api/product/add-product`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          // Show success message
          Alert.alert("Success", "Product added successfully!", [
            {
              text: "OK",
              onPress: () => router.push("../(inventory)"),
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error submitting product:", error);

      // Handle different types of errors
      let errorMessage = "Failed to add product. Please try again.";

      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Request made but no response
        errorMessage = "Network error. Please check your connection.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
      setLoadingStatus("");
    }
  };

  return (
    <View className="flex-1 bg-gray-200">
      {loading && (
        <LoadingOverlay
          loadingStatus={loadingStatus}
          loadingProgress={loadingProgress}
        />
      )}

      <ScrollView ref={scrollViewRef} className="flex-1">
        <View>
          <View className="px-4 border-b border-gray-200 py-2 bg-white rounded-lg">
            <Text className="text-xl font-semibold text-gray-800">
              Category : {category}
            </Text>
            <Text className="text-gray-500">
              Add products to your inventory
            </Text>
          </View>

          <ImageUploadSection
            productImages={productImages}
            onImagePick={handleImagePick}
            errors={errors}
            ref={(ref) => (fieldRefs.current["images"] = ref)}
          />

          <FormSection
            title="Required Information"
            fields={requiredFields}
            formData={formData}
            requiredFields={requiredFields}
            errors={errors}
            onChange={handleChange}
            fieldRefs={fieldRefs}
          />

          <FormSection
            title="Additional Information"
            fields={optionalFields}
            formData={formData}
            requiredFields={[]}
            errors={errors}
            onChange={handleChange}
            fieldRefs={fieldRefs}
          />
          <ProductSettings
            formData={formData}
            onChange={handleChange}
            errors={errors}
            fieldRefs={fieldRefs}
          />

          <View className="p-4 bg-white border-t border-gray-200">
            <Button
              size="lg"
              variant="destructive"
              onPress={handleSubmit}
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 h-12 rounded-xl shadow-sm"
            >
              <Text className="text-white font-semibold text-lg">
                Add Product
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Product;
