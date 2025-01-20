// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   SafeAreaView,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import { FontAwesome } from "@expo/vector-icons";
// import { Button } from "~/components/ui/button";
// import HelpModal from "./helperFunction/helpModal";
// import { prompts } from "./helperFunction/prompt";
// import {
//   callGoogleVisionAsync,
//   analyzeTextWithGemini,
// } from "./helperFunction/apiCall";
// import { useRouter } from "expo-router";
// import { convertToBase64 } from "../../utils/imageConversion";
// import { pickImage } from "../../utils/imagePicker";
// import DocumentItem from "./helperFunction/documentItem";
// import UseDocumentData from "./helperFunction/UseDocumentData";
// import { Progress } from "~/components/ui/progress";
// import uploadToCloudinary from "../../utils/uploadedImages";
// import { useTranslation } from "react-i18next";

// const Index = () => {
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(false);
//   const [loadingStatus, setLoadingStatus] = useState("");
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [error, setError] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [verificationStatus, setVerificationStatus] = useState({});
//   const [images, setImages] = useState({});
//   const router = useRouter();

//   const { documentData, updateDocumentData } = UseDocumentData();
//   useEffect(() => {
//     if (allDocumentsVerified) {
//       setError("");
//     }
//   }, [verificationStatus]);

//   const handleDocumentPress = async (title) => {
//     setLoading(true);
//     setError("");
//     setLoadingProgress(0);
//     setLoadingStatus("Initializing document scan...");

//     try {
//       setLoadingStatus("Opening camera...");
//       setLoadingProgress(10);
//       const urllocal = await pickImage();

//       if (urllocal) {
//         setLoadingStatus("Processing image...");
//         setLoadingProgress(30);
//         setImages((prev) => ({ ...prev, [title]: urllocal }));

//         setLoadingStatus("Converting image...");
//         const base64Image = await convertToBase64(urllocal);
//         setLoadingProgress(50);

//         setLoadingStatus("Extracting text from document...");
//         const extractedText = await callGoogleVisionAsync(base64Image);
//         setLoadingProgress(70);

//         const prompt = prompts[title];
//         const updatedPrompt = JSON.stringify(prompt + extractedText);

//         if (updatedPrompt) {
//           setLoadingStatus("Verifying document details...");
//           setLoadingProgress(90);
//           const response = await analyzeTextWithGemini(updatedPrompt);

//           if (response[0] === false) {
//             setError(
//               `Invalid ${title}. Please upload a valid document, or try again.`
//             );
//             setVerificationStatus((prev) => ({ ...prev, [title]: false }));
//           } else {
//             setError("");
//             setLoadingStatus("Document verified successfully!");
//             setLoadingProgress(100);
//             setVerificationStatus((prev) => ({ ...prev, [title]: true }));
//             const cleanResponse = response.filter((item) => item !== undefined);
//             updateDocumentData(title, cleanResponse);
//           }
//         } else {
//           setError("No prompt found for this document type");
//         }
//       }
//     } catch (err) {
//       console.error("Error in handleDocumentPress:", err);
//       setError(`Error processing ${title}. Please try again.`);
//       setVerificationStatus((prev) => ({ ...prev, [title]: false }));
//     } finally {
//       setTimeout(() => {
//         setLoading(false);
//         setLoadingStatus("");
//         setLoadingProgress(0);
//       }, 1000);
//     }
//   };
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       setLoadingProgress(0);
//       setLoadingStatus("Starting document upload...");

//       const totalDocuments = Object.keys(images).length;
//       let completedDocuments = 0;

//       for (const [title, imageUri] of Object.entries(images)) {
//         try {
//           setLoadingStatus(`Uploading ${title}...`);
//           const cloudinaryUrl = await uploadToCloudinary(imageUri);

//           const docKey = title.replace(/\s/g, "");
//           const currentDoc = documentData.find(
//             (doc) => Object.keys(doc)[0] === docKey
//           );

//           if (currentDoc && currentDoc[docKey]) {
//             setLoadingStatus(`Processing ${title} data...`);
//             const cleanResponse = currentDoc[docKey].filter(
//               (item) => item !== undefined
//             );
//             const updatedResponse = [...cleanResponse, cloudinaryUrl];
//             updateDocumentData(title, updatedResponse);
//           }

//           completedDocuments++;
//           setLoadingProgress((completedDocuments / totalDocuments) * 100);
//         } catch (uploadError) {
//           console.error(`Error uploading ${title}:`, uploadError);
//           throw uploadError;
//         }
//       }

//       setLoadingStatus("Finalizing submission...");
//       setLoadingProgress(100);
//       router.push("./verifiedData/bankDetails");
//     } catch (error) {
//       setError("Failed to upload images. Please try again.");
//       console.error("Error during upload:", error);
//     } finally {
//       setLoading(false);
//       setLoadingStatus("");
//       setLoadingProgress(0);
//     }
//   };

//   const requiredDocuments = [
//     "Cancelled Bank Cheque",
//     "PAN Card",
//     "AADHAAR Card",
//     "GSTIN Certificate",
//     "Address Proof",
//   ];

//   const allDocumentsVerified = requiredDocuments.every(
//     (doc) => verificationStatus[doc] === true
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {/* Progress bar */}
//       <Progress
//         value={loadingProgress}
//         className="web:w-[60%] transition-all duration-300"
//       />

//       <View className="flex-1 pb-20">
//         <Text className="text-2xl my-4 font-semibold text-center text-gray-800">
//           Document Verification
//         </Text>

//         <ScrollView
//           className="flex-1"
//           contentContainerStyle={{ paddingBottom: 20 }}
//           showsVerticalScrollIndicator={false}
//         >
//           <View className="flex flex-row flex-wrap justify-around px-4 gap-y-4">
//             {[
//               { icon: "bank", title: "Cancelled Bank Cheque" },
//               { icon: "id-card", title: "PAN Card" },
//               { icon: "id-card", title: "AADHAAR Card" },
//               { icon: "file-text", title: "GSTIN Certificate" },
//               { icon: "file-text", title: "Address Proof" },
//             ].map((doc, index) => (
//               <DocumentItem
//                 key={index}
//                 icon={doc.icon}
//                 title={doc.title}
//                 onPress={() => handleDocumentPress(doc.title)}
//                 status={verificationStatus[doc.title]}
//                 imageUri={images[doc.title]}
//               />
//             ))}
//           </View>

//           <View className="px-4 mt-4">
//             {loading && (
//               <View className="bg-blue-50 rounded-xl p-4 mb-4 shadow-sm">
//                 <ActivityIndicator size="large" color="#0096FF" />
//                 <Text className="text-lg font-semibold text-center mt-2 text-blue-800">
//                   {loadingStatus}
//                 </Text>
//                 <Text className="text-sm text-blue-600 text-center mt-1">
//                   {loadingProgress.toFixed(0)}% Complete
//                 </Text>
//               </View>
//             )}

//             {error && !allDocumentsVerified && (
//               <View className="mb-4 bg-red-50 rounded-xl p-4 my-8">
//                 <Text className="text-red-700 font-medium text-lg text-center">
//                   {error}
//                 </Text>
//               </View>
//             )}

//             {!loading && allDocumentsVerified && (
//               <Button
//                 size="lg"
//                 variant="destructive"
//                 onPress={handleSubmit}
//                 className="w-full bg-blue-500 active:bg-blue-400 rounded-xl shadow-md mt-16"
//               >
//                 <Text className="text-white font-semibold text-xl">Submit</Text>
//               </Button>
//             )}
//           </View>
//         </ScrollView>
//       </View>

//       <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-4">
//         <TouchableOpacity
//           className="flex flex-row justify-center items-center bg-blue-50 p-3 rounded-xl"
//           onPress={() => setModalVisible(true)}
//         >
//           <FontAwesome name="question-circle" size={24} color="#0096FF" />
//           <Text className="text-blue-500 text-base font-semibold ml-2">
//             {t("Need help with documents?")}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <HelpModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//       />
//     </SafeAreaView>
//   );
// };

// export default Index;

import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
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
import { Progress } from "~/components/ui/progress";
import uploadToCloudinary from "../../utils/uploadedImages";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({});
  const [images, setImages] = useState({});
  const router = useRouter();

  const { documentData, updateDocumentData } = UseDocumentData();
  useEffect(() => {
    if (allDocumentsVerified) {
      setError("");
    }
  }, [verificationStatus]);

  const handleDocumentPress = async (title) => {
    setLoading(true);
    setError("");
    setLoadingProgress(0);
    setLoadingStatus(t("Initializing document scan..."));

    try {
      setLoadingStatus(t("Opening camera..."));
      setLoadingProgress(10);
      const urllocal = await pickImage();

      if (urllocal) {
        setLoadingStatus(t("Processing image..."));
        setLoadingProgress(30);
        setImages((prev) => ({ ...prev, [title]: urllocal }));

        setLoadingStatus(t("Converting image..."));
        const base64Image = await convertToBase64(urllocal);
        setLoadingProgress(50);

        setLoadingStatus(t("Extracting text from document..."));
        const extractedText = await callGoogleVisionAsync(base64Image);
        setLoadingProgress(70);

        const prompt = prompts[title];

        const updatedPrompt = prompt + extractedText;
        console.log(updatedPrompt);
        if (updatedPrompt) {
          setLoadingStatus(t("Verifying document details..."));
          setLoadingProgress(90);
          const response = await analyzeTextWithGemini(updatedPrompt);

          if (response[0] === false) {
            setError(
              t("Invalid") +
                ` ${t(title)}. ` +
                t("Please upload a valid document, or try again.")
            );
            setVerificationStatus((prev) => ({ ...prev, [title]: false }));
          } else {
            setError("");
            setLoadingStatus(t("Document verified successfully!"));
            setLoadingProgress(100);
            setVerificationStatus((prev) => ({ ...prev, [title]: true }));
            const cleanResponse = response.filter((item) => item !== undefined);
            updateDocumentData(title, cleanResponse);
          }
        } else {
          setError(t("No prompt found for this document type"));
        }
      }
    } catch (err) {
      console.error("Error in handleDocumentPress:", err);
      setError(
        t("Error processing") + ` ${t(title)}. ` + t("Please try again.")
      );
      setVerificationStatus((prev) => ({ ...prev, [title]: false }));
    } finally {
      setTimeout(() => {
        setLoading(false);
        setLoadingStatus("");
        setLoadingProgress(0);
      }, 1000);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setLoadingProgress(0);
      setLoadingStatus(t("Starting document upload..."));

      const totalDocuments = Object.keys(images).length;
      let completedDocuments = 0;

      for (const [title, imageUri] of Object.entries(images)) {
        try {
          setLoadingStatus(t("Uploading") + ` ${t(title)}...`);
          const cloudinaryUrl = await uploadToCloudinary(imageUri);

          const docKey = title.replace(/\s/g, "");
          const currentDoc = documentData.find(
            (doc) => Object.keys(doc)[0] === docKey
          );

          if (currentDoc && currentDoc[docKey]) {
            setLoadingStatus(t("Processing") + ` ${t(title)} ` + t("data..."));
            const cleanResponse = currentDoc[docKey].filter(
              (item) => item !== undefined
            );
            const updatedResponse = [...cleanResponse, cloudinaryUrl];
            updateDocumentData(title, updatedResponse);
          }

          completedDocuments++;
          setLoadingProgress((completedDocuments / totalDocuments) * 100);
        } catch (uploadError) {
          console.error(`Error uploading ${title}:`, uploadError);
          throw uploadError;
        }
      }

      setLoadingStatus(t("Finalizing submission..."));
      setLoadingProgress(100);
      router.push("./verifiedData/bankDetails");
    } catch (error) {
      setError(t("Failed to upload images. Please try again."));
      console.error("Error during upload:", error);
    } finally {
      setLoading(false);
      setLoadingStatus("");
      setLoadingProgress(0);
    }
  };

  const requiredDocuments = [
    "Cancelled Bank Cheque",
    "PAN Card",
    "AADHAAR Card",
    "GSTIN Certificate",
    "Address Proof",
  ];

  const allDocumentsVerified = requiredDocuments.every(
    (doc) => verificationStatus[doc] === true
  );

  const documentsList = [
    { icon: "bank", title: "Cancelled Bank Cheque" },
    { icon: "id-card", title: "PAN Card" },
    { icon: "id-card", title: "AADHAAR Card" },
    { icon: "file-text", title: "GSTIN Certificate" },
    { icon: "file-text", title: "Address Proof" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Progress
        value={loadingProgress}
        className="web:w-[60%] transition-all duration-300"
      />

      <View className="flex-1 pb-20">
        <Text className="text-2xl my-4 font-semibold text-center text-gray-800">
          {t("Document Verification")}
        </Text>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-row flex-wrap justify-around px-4 gap-y-4">
            {documentsList.map((doc, index) => (
              <DocumentItem
                key={index}
                icon={doc.icon}
                title={doc.title}
                onPress={() => handleDocumentPress(doc.title)}
                status={verificationStatus[doc.title]}
                imageUri={images[doc.title]}
              />
            ))}
          </View>

          <View className="px-4 mt-4">
            {loading && (
              <View className="bg-blue-50 rounded-xl p-4 mb-4 shadow-sm">
                <ActivityIndicator size="large" color="#0096FF" />
                <Text className="text-lg font-semibold text-center mt-2 text-blue-800">
                  {loadingStatus}
                </Text>
                <Text className="text-sm text-blue-600 text-center mt-1">
                  {loadingProgress.toFixed(0)}% {t("Complete")}
                </Text>
              </View>
            )}

            {error && !allDocumentsVerified && (
              <View className="mb-4 bg-red-50 rounded-xl p-4 my-8">
                <Text className="text-red-700 font-medium text-lg text-center">
                  {error}
                </Text>
              </View>
            )}

            {!loading && allDocumentsVerified && (
              <Button
                size="lg"
                variant="destructive"
                onPress={handleSubmit}
                className="w-full bg-blue-500 active:bg-blue-400 rounded-xl shadow-md mt-16"
              >
                <Text className="text-white font-semibold text-xl">
                  {t("Submit")}
                </Text>
              </Button>
            )}
          </View>
        </ScrollView>
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-4">
        <TouchableOpacity
          className="flex flex-row justify-center items-center bg-blue-50 p-3 rounded-xl"
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome name="question-circle" size={24} color="#0096FF" />
          <Text className="text-blue-500 text-base font-semibold ml-2">
            {t("Need help with documents?")}
          </Text>
        </TouchableOpacity>
      </View>

      <HelpModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Index;
