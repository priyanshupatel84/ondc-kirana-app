import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

const ImageButton = React.forwardRef(
  ({ imageUri, label, onPress, error, required, t }, ref) => (
    <TouchableOpacity
      ref={ref}
      onPress={onPress}
      className="w-[47%] aspect-square rounded-lg overflow-hidden border p-1 border-blue-500"
    >
      {imageUri ? (
        <View className="h-full w-full">
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: "90%" }}
            resizeMode="contain"
          />
          <View className="h-[10%] bg-white justify-center">
            <Text className="text-gray-700 text-center font-medium text-sm">
              {label} {required && <Text className="text-red-500">*</Text>}
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center bg-gray-100 p-3">
          <View
            className={` ${
              error ? "border-red-300" : "border-gray-300"
            } rounded-lg p-4 w-full h-full items-center justify-center`}
          >
            <Text
              className={`text-base font-medium ${
                error ? "text-red-600" : "text-gray-600"
              } mb-2 text-center`}
            >
              {label} {required && <Text className="text-red-500">*</Text>}
            </Text>
            <Text className="text-blue-500 font-medium text">
              {t("Tap to upload")}
            </Text>
            {required && !imageUri && (
              <Text className="text-red-500 text mt-1">{t("Required")}</Text>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  )
);

ImageButton.displayName = "ImageButton";

const ImageUploadSection = React.forwardRef(
  ({ productImages, onImagePick, errors }, ref) => {
    const { t } = useTranslation();
    const imageButtons = [
      { key: "image1", label: t("Front View"), required: true },
      { key: "image2", label: t("Side View"), required: true },
      { key: "image3", label: t("Additional View"), required: true },
      { key: "backImage", label: t("Back side of Product"), required: false },
    ];

    return (
      <View ref={ref} className="bg-white rounded-xl p-3 shadow-sm m-2">
        <View>
          <Text className="text-xl font-semibold text-gray-800 mb-2 p-1 text-center bg-blue-500 text-white rounded-lg">
            {t("Images")}
          </Text>
          <Text className="text-gray-500 mb-2 px-2">
            {t("First 3 product images are mandatory.")}
          </Text>
        </View>
        <View className="flex-row flex-wrap justify-center gap-2">
          {imageButtons.map((button) => (
            <ImageButton
              key={button.key}
              ref={(buttonRef) => {
                if (ref?.current) {
                  ref.current[button.key] = buttonRef;
                }
              }}
              imageUri={productImages[button.key]}
              label={button.label}
              required={button.required}
              onPress={() => onImagePick(button.key)}
              error={errors?.[button.key]}
              t={t}
            />
          ))}
        </View>
        {errors?.images && (
          <Text className="text-red-500 text-sm mt-2 px-2">
            {t(errors.images)}
          </Text>
        )}
        {errors?.imageProcessing && (
          <Text className="text-red-500 text-sm mt-2 px-2">
            {t(errors.imageProcessing)}
          </Text>
        )}
      </View>
    );
  }
);

ImageUploadSection.displayName = "ImageUploadSection";

export default ImageUploadSection;
