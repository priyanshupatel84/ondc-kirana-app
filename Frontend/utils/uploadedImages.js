import * as FileSystem from "expo-file-system";

const uploadToCloudinary = async (imageUri) => {
  const UPLOAD_PRESET = process.env.EXPO_PUBLIC_UPLOAD_PRESET;
  const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME;

  try {
    if (!UPLOAD_PRESET || !CLOUD_NAME) {
      console.error("Missing Cloudinary configuration:", {
        UPLOAD_PRESET,
        CLOUD_NAME,
      });
      throw new Error("Missing Cloudinary configuration");
    }

    let base64ImageData;
    if (imageUri.startsWith("file://")) {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }
    const data = new FormData();

    if (base64ImageData) {
      data.append("file", `data:image/jpeg;base64,${base64ImageData}`);
    } else {
      data.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "upload.jpg",
      });
    }

    data.append("upload_preset", UPLOAD_PRESET);

    console.log("Uploading to Cloudinary...", {
      cloudName: CLOUD_NAME,
      uploadPreset: UPLOAD_PRESET,
      imageUriType: typeof imageUri,
      imageUriStart: imageUri.substring(0, 50) + "...",
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Cloudinary upload failed: ${response.status} ${response.statusText}`
      );
    }

    const responseData = await response.json();

    if (!responseData || !responseData.secure_url) {
      throw new Error("Invalid Cloudinary response");
    }
    return responseData.secure_url;
  } catch (error) {
    throw error;
  }
};

export default uploadToCloudinary;
