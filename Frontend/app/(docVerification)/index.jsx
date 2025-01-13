import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";
import HelpModal from "./helperFunction/helpModal";
import { prompts } from "./helperFunction/prompt";
import {
  callGoogleVisionAsync,
  analyzeTextWithGemini,
} from "./helperFunction/apiCall";
import { useRouter } from "expo-router";
import { convertToBase64 } from "../../utils/imageConversion";
import { pickImage } from "../../utils/imagePicker";
import DocumentItem from "./helperFunction/documentItem";
import UseDocumentData from "./helperFunction/UseDocumentData";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({});
  const [images, setImages] = useState({});
  const router = useRouter();

  const { updateDocumentData } = UseDocumentData(); //custom hook

  const handleDocumentPress = async (title) => {
    setLoading(true);
    setError("");

    try {
      const urllocal = await pickImage();

      if (urllocal) {
        setImages((prev) => ({ ...prev, [title]: urllocal }));
        const base64Image = await convertToBase64(urllocal);
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
            updateDocumentData(title, response);
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

  const requiredDocuments = [
    "Cancelled Bank Cheque",
    "PAN Card",
    "ID Card",
    "GSTIN Certificate",
    "Address Proof",
  ];

  const allDocumentsVerified = requiredDocuments.every(
    (doc) => verificationStatus[doc] === true
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex flex-col justify-center ">
        <Text className="text-[23px] my-5 font-semibold text-center">
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
          <Text className="border-[2px] border-red-600 font-semibold text-red-700 text-lg px-3 py-1 my-5 rounded-lg text-center w-3/4 mx-auto">
            {error}
          </Text>
        )}
      </View>

      {!loading && !error && allDocumentsVerified && (
        <Button
          size="lg"
          variant="destructive"
          onPress={() => {
            //console.log(images);
            router.push("./verifiedData/bankDetails");
          }}
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
