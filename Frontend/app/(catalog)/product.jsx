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
import { scrollToError } from "./component/scrollToError";
import uploadToCloudinary from "../../utils/uploadedImages";
import SuccessPopup from "../myComponent/successPopup";

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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
    image1: null,
    image2: null,
    image3: null,
    backImage: null,
  });
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
      console.log("Starting form submission...");
      console.log("Form Data:", JSON.stringify(formData, null, 2));

      if (validateAllFields()) {
        setLoading(true);
        setLoadingStatus("Uploading images...");

        // Upload all images to Cloudinary
        const uploadedImages = {};
        const totalImages = Object.keys(productImages).length;
        let currentImageIndex = 0;

        for (const [key, uri] of Object.entries(productImages)) {
          if (uri) {
            try {
              setLoadingProgress((currentImageIndex / totalImages) * 100);
              setLoadingStatus(`Uploading ${key}...`);
              const cloudinaryUrl = await uploadToCloudinary(uri);
              uploadedImages[key] = cloudinaryUrl;
              currentImageIndex++;
            } catch (error) {
              console.error(`Error uploading ${key}:`, error);
              throw new Error(`Failed to upload ${key}: ${error.message}`);
            }
          }
        }

        setLoadingStatus("Adding product...");
        setLoadingProgress(90);

        const submitData = {
          ...formData,
          images: uploadedImages, // Use the Cloudinary URLs instead of local URIs
          category: category,
        };

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

        setLoadingProgress(100);

        if (response.data) {
          setShowSuccessPopup(true); // Show success popup instead of Alert
          // Navigate after popup closes
          setTimeout(() => {
            router.push("../(inventory)");
          }, 500); // Wait for popup duration (2000ms) + animation time
        }
      }
    } catch (error) {
      console.error("Error submitting product:", error);

      if (error.response) {
        const { data, status } = error.response;
        console.log(`Server responded with status ${status}`);
        console.log("Error response data:", data);

        if (data.type === "duplicate") {
          setErrors((prev) => ({
            ...prev,
            [data.field]: data.message,
          }));

          if (fieldRefs.current[data.field]) {
            scrollToError(data.field, fieldRefs, scrollViewRef);
          }

          Alert.alert("Duplicate Product", data.message, [{ text: "OK" }]);
        } else if (data.errors) {
          setErrors((prev) => ({
            ...prev,
            ...data.errors,
          }));

          const firstErrorField = Object.keys(data.errors)[0];
          if (firstErrorField && fieldRefs.current[firstErrorField]) {
            scrollToError(firstErrorField, fieldRefs, scrollViewRef);
          }
        } else {
          Alert.alert(
            "Error",
            data.message || "Failed to add product. Please try again."
          );
        }
      } else if (error.message && error.message.includes("Failed to upload")) {
        Alert.alert(
          "Image Upload Error",
          "Failed to upload one or more images. Please try again."
        );
      } else if (error.request) {
        Alert.alert(
          "Network Error",
          "Please check your internet connection and try again."
        );
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      setLoadingStatus("");
      setLoadingProgress(0);
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
      <SuccessPopup
        visible={showSuccessPopup}
        message="Product added successfully!"
        title="Success!"
        onClose={() => setShowSuccessPopup(false)}
      />

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
      >
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
