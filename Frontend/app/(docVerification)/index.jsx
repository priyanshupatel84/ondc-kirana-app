import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DocumentItem from "./documentItem";
import HelpModal from "./helpModal";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { prompts } from "./prompt";
import { callGoogleVisionAsync, analyzeTextWithGemini } from "./apiCall";
import UseVerifiedDocumentsData from "./UseVerifiedDocumentsData";

const requiredDocuments = [
  "Cancelled Bank Cheque",
  "PAN Card",
  "ID Card",
  "GSTIN Certificate",
  "Address Proof",
];

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationStatus, setVerificationStatus] = useState({});
  const [images, setImages] = useState({}); // Store images for each document
  const [modalVisible, setModalVisible] = useState(false);
  const [verifiedDocuments, setVerifiedDocuments] = useState([]);
  const router = useRouter();

  const verifiedData = UseVerifiedDocumentsData(
    JSON.stringify(verifiedDocuments)
  );

  const handleDocumentPress = async (title) => {
    setLoading(true);
    setError("");

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImages((prev) => ({ ...prev, [title]: uri })); // Set image for the specific document type
        const base64Image = await convertToBase64(uri);
        const extractedText = await callGoogleVisionAsync(base64Image);
        const prompt = prompts[title];
        const updatedPrompt = JSON.stringify(prompt + extractedText);

        if (updatedPrompt) {
          const response = await analyzeTextWithGemini(updatedPrompt);

          if (response[0] === false) {
            setError("This is not a valid document.");
            setVerificationStatus((prev) => ({ ...prev, [title]: false }));
          } else {
            setVerificationStatus((prev) => ({ ...prev, [title]: true }));

            // Check if the document already exists in the verifiedDocuments array
            setVerifiedDocuments((prev) => {
              const existingDocIndex = prev.findIndex(
                (doc) => doc.documentType === title
              );
              if (existingDocIndex !== -1) {
                // Update the existing document
                const updatedDocuments = [...prev];
                updatedDocuments[existingDocIndex] = {
                  documentType: title,
                  info: response,
                };
                return updatedDocuments;
              } else {
                // Add a new document
                return [...prev, { documentType: title, info: response }];
              }
            });
          }
        } else {
          setError("No prompt found for this document type");
        }
      }
    } catch (err) {
      setError("An error occurred while processing the image.");
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = async (uri) => {
    try {
      return await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (error) {
      throw new Error("Failed to convert image to Base64");
    }
  };

  const canProceed =
    !loading &&
    requiredDocuments.every((doc) => verificationStatus[doc] === true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex flex-col justify-center items-center p-2 bg-white">
        <Text className="text-2xl my-5 font-semibold text-center">
          Document Verification
        </Text>
        <ScrollView>
          <View className="flex flex-row flex-wrap justify-around w-full p-2 gap-2">
            {[
              { icon: "bank", title: "Cancelled Bank Cheque" },
              { icon: "id-card", title: "PAN Card" },
              { icon: "id-card", title: "ID Card" },
              { icon: "file-text", title: "GSTIN Certificate" },
              { icon: "file-text", title: "Address Proof" },
            ].map((doc, index) => (
              <DocumentItem
                key={index}
                icon={doc.icon}
                title={doc.title}
                onPress={() => handleDocumentPress(doc.title)}
                status={verificationStatus[doc.title]}
                imageUri={images[doc.title]} // Pass the specific image URI
              />
            ))}
          </View>
        </ScrollView>
        {loading && (
          <View className="flex items-center justify-center mt-4">
            <ActivityIndicator size="large" color="#0096FF" />
            <Text className="text-xl font-semibold">Verifying</Text>
          </View>
        )}
        {error && (
          <Text className="border-[2px] border-red-600 font-semibold text-red-700 text-lg px-3 py-2 my-5 rounded-lg">
            {error}
          </Text>
        )}
      </View>
      {canProceed && (
        <Button
          size="lg"
          variant="destructive"
          onPress={() => router.push("../(tabs)/home")}
          className="mx-auto my-20 w-5/6 bg-blue-500 active:bg-blue-400"
        >
          <Text className="text-white font-semibold text-xl">Next</Text>
        </Button>
      )}
      <TouchableOpacity
        className="w-3/4 m-1 absolute bottom-0 self-center flex flex-row justify-center items-center mt-4 p-2"
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="question-circle" size={28} color="bg-blue-500" />
        <Text className="text-blue text-lg font-bold text-center ml-2">
          Help, I don't have these documents
        </Text>
      </TouchableOpacity>

      <HelpModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Index;
