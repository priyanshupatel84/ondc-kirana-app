// KYCDocuments.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";

const KYCDocuments = ({ uploadedDocuments, setUploadedDocuments, errors }) => {
  const pickDocument = async (type) => {
    let result = await DocumentPicker.getDocumentAsync({});
    console.log(result);

    // Check if the document selection was successful
    if (result && !result.canceled) {
      const selectedAsset = result.assets[0]; // Access the first asset
      console.log("File Name:", selectedAsset.name);
      console.log("File URI:", selectedAsset.uri);

      // Update the corresponding document name based on the type
      setUploadedDocuments((prev) => ({
        ...prev,
        [type]: selectedAsset.name,
      }));
    } else {
      console.log("Document selection was canceled");
    }
  };

  return (
    <View className="my-3 pb-2">
      <Text className="text-xl pb-1 font-semibold text-center">
        ────── KYC Documents ──────
      </Text>

      <Text className="text-lg mt-2">Address Proof *</Text>
      <TouchableOpacity
        className="p-2 bg-gray-100 mt-1 border border-gray-300 rounded"
        onPress={() => pickDocument("addressProof")}
      >
        {uploadedDocuments.addressProof ? (
          <Text className="text-green-600">
            Uploaded: {uploadedDocuments.addressProof}
          </Text>
        ) : (
          <Text>Upload Address Proof</Text>
        )}
      </TouchableOpacity>
      {errors.addressProof && (
        <Text className="text-red-500">{errors.addressProof}</Text>
      )}

      <Text className="text-lg mt-2">ID Proof *</Text>
      <TouchableOpacity
        className="p-2 bg-gray-100 mt-1 border border-gray-300 rounded"
        onPress={() => pickDocument("idProof")}
      >
        {uploadedDocuments.idProof ? (
          <Text className="text-green-600">
            Uploaded: {uploadedDocuments.idProof}
          </Text>
        ) : (
          <Text>Upload ID Proof</Text>
        )}
      </TouchableOpacity>
      {errors.idProof && <Text className="text-red-500">{errors.idProof}</Text>}

      <Text className="text-lg mt-2">PAN Card Image *</Text>
      <TouchableOpacity
        className="p-2 bg-gray-100 mt-1 border border-gray-300 rounded"
        onPress={() => pickDocument("panCard")}
      >
        {uploadedDocuments.panCard ? (
          <Text className="text-green-600">
            Uploaded: {uploadedDocuments.panCard}
          </Text>
        ) : (
          <Text>Upload PAN Card Image</Text>
        )}
      </TouchableOpacity>
      {errors.panCard && <Text className="text-red-500">{errors.panCard}</Text>}

      <Text className="text-lg mt-2">GSTIN Certificate *</Text>
      <TouchableOpacity
        className="p-2 bg-gray-100 mt-1 border border-gray-300 rounded"
        onPress={() => pickDocument("gstinCertificate")}
      >
        {uploadedDocuments.gstinCertificate ? (
          <Text className="text-green-600">
            Uploaded: {uploadedDocuments.gstinCertificate}
          </Text>
        ) : (
          <Text>Upload GSTIN Certificate</Text>
        )}
      </TouchableOpacity>
      {errors.gstinCertificate && (
        <Text className="text-red-500">{errors.gstinCertificate}</Text>
      )}
    </View>
  );
};

export default KYCDocuments;
