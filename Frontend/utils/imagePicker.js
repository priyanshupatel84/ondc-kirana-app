// imagePickerUtils.js
import * as ImagePicker from "expo-image-picker";

export const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri; // Return the URI of the selected image
  }
  return null; // Return null if the user cancels
};
