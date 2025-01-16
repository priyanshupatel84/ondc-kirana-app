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
      // Otherwise use the URI directly
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
      //console.error("Cloudinary error response:", errorText);
      throw new Error(
        `Cloudinary upload failed: ${response.status} ${response.statusText}`
      );
    }

    const responseData = await response.json();

    if (!responseData || !responseData.secure_url) {
      //console.error("Invalid Cloudinary response:", responseData);
      throw new Error("Invalid Cloudinary response");
    }

    // console.log("Successfully uploaded to Cloudinary:", {
    //   url: responseData.secure_url,
    //   publicId: responseData.public_id,
    // });

    return responseData.secure_url;
  } catch (error) {
    // console.error("Error uploading to Cloudinary:", {
    //   message: error.message,
    //   stack: error.stack,
    // });
    throw error;
  }
};

export default uploadToCloudinary;
