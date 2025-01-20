import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Button } from "~/components/ui/button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { pickImageWithEdit } from "../../utils/imagePicker";
import { useFormValidation } from "./component/validationUtils";
import LoadingOverlay from "./component/LoadingOverlay";
import ImageUploadSection from "./component/ImageUploadSection";
import FormSection from "./component/FormSection";
import { useTranslation } from "react-i18next";
import ProductSettings from "./component/productSettings";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import SuccessPopup from "../myComponent/successPopup";

const ProductEdit = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const scrollViewRef = useRef(null);
  const fieldRefs = useRef({});
  const API_URL = process.env.EXPO_PUBLIC_MY_API_URL;
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

  const [formData, setFormData] = useState({
    ...requiredFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
    ...optionalFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
    category: "",
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

  const { validateSingleField, validateAllFields } = useFormValidation(
    formData,
    productImages,
    setErrors,
    fieldRefs,
    scrollViewRef
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setLoadingStatus("Fetching product details...");

        const response = await axios.get(`${API_URL}/api/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const productData = response.data.product;
          setFormData({
            productCode: productData.productCode || "",
            productName: productData.productName || "",
            shortDescription: productData.shortDescription || "",
            longDescription: productData.longDescription || "",
            weight: productData.weight || "",
            manufacturerName: productData.manufacturerName || "",
            mrp: productData.mrp || "",
            sellingPrice: productData.sellingPrice || "",
            countryOfOrigin: productData.countryOfOrigin || "",
            gstPercentage: productData.gstPercentage || "",
            length: productData.length || "",
            breadth: productData.breadth || "",
            height: productData.height || "",
            instructions: productData.instructions || "",
            commodityName: productData.commodityName || "",
            manufactureDate: productData.manufactureDate || "",
            uomUnit: productData.uomUnit || "",
            uomValue: productData.uomValue || "",
            quantity: productData.quantity || "",
            storageInstructions: productData.storageInstructions || "",
            allergenInfo: productData.allergenInfo || "",
            fssaiCertification: productData.fssaiCertification || "",
            shelfLife: productData.shelfLife || "",
            customerCare: productData.customerCare || "",
            category: productData.category || "",
            stock: productData.stock?.toString() || "",
            CancellableSetting: productData.cancellable || false,
            ReturnableSetting: productData.returnable || false,
            CashOnDeliverySetting: productData.cashOnDelivery || false,
            returnWindow: productData.returnWindow || "",
            cancellationWindow: productData.cancellationWindow || "",
          });

          if (
            productData.productImages &&
            productData.productImages.length > 0
          ) {
            const images = {};
            productData.productImages.forEach((image, index) => {
              if (index === 0) {
                images.backImage = image;
              } else {
                images[`image${index}`] = image;
              }
            });
            setProductImages(images);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        Alert.alert("Error", "Failed to fetch product details");
      } finally {
        setLoading(false);
        setLoadingStatus("");
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    validateSingleField(field, value);
  };

  const handleImagePick = async (imageKey) => {
    try {
      const imageUri = await pickImageWithEdit();
      if (imageUri) {
        setProductImages((prev) => ({
          ...prev,
          [imageKey]: imageUri,
        }));
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
      console.log("Current form data:", formData);
      console.log("Current images:", productImages);

      if (validateAllFields()) {
        setLoading(true);
        setLoadingStatus("Updating product...");

        const submitData = {
          ...formData,
          images: productImages,
        };

        const response = await axios.put(
          `${API_URL}/api/product/edit/${id}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          setShowSuccessPopup(true);
          setTimeout(() => {
            router.replace("(inventory)");
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error updating product:", error);
      let errorMessage = "Failed to update product. Please try again.";

      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
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
          t={t}
        />
      )}
      <SuccessPopup
        visible={showSuccessPopup}
        message="Product updated successfully!"
        title="Success!"
        onClose={() => setShowSuccessPopup(false)}
      />

      <ScrollView ref={scrollViewRef} className="flex-1">
        <View>
          <View className="px-4 border-b border-gray-200 py-2 bg-white rounded-lg">
            <Text className="text-xl font-semibold text-gray-800">
              {t("Edit Product")}
            </Text>
            <Text className="text-gray-500">
              {t("Update your product information")}
            </Text>
          </View>

          <ImageUploadSection
            productImages={productImages}
            onImagePick={handleImagePick}
            errors={errors}
            ref={(ref) => (fieldRefs.current["images"] = ref)}
          />

          <FormSection
            title={t("Required Information")}
            fields={requiredFields}
            formData={formData}
            requiredFields={requiredFields}
            errors={errors}
            onChange={handleChange}
            fieldRefs={fieldRefs}
          />

          <FormSection
            title={t("Additional Information")}
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
            t={t}
          />

          <View className="p-4 bg-white border-t border-gray-200">
            <Button
              size="lg"
              variant="destructive"
              onPress={handleSubmit}
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 h-12 rounded-xl shadow-sm"
            >
              <Text className="text-white font-semibold text-lg">
                {t("Update Product")}
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductEdit;
