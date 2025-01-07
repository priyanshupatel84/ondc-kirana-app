import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import KYCDocuments from "./kycDocuments";
import { validateKYCForm, validateKYCDocuments } from "./validation";
import { useRouter } from "expo-router";

const KYCForm = () => {
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [registeredAddress, setRegisteredAddress] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [pan, setPan] = useState("");
  const [gstin, setGstin] = useState("");
  const [fssaiNumber, setFssaiNumber] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState({
    addressProof: "",
    idProof: "",
    panCard: "",
    gstinCertificate: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const formData = {
      storeName,
      registeredAddress,
      email,
      mobile,
      pan,
      gstin,
      fssaiNumber,
    };

    // Validate KYC Form
    const { isValid: isFormValid, errors: formErrors } =
      validateKYCForm(formData);
    // Validate KYC Documents
    const { isValid: isDocumentsValid, errors: documentErrors } =
      validateKYCDocuments(uploadedDocuments);

    // Combine errors
    const combinedErrors = { ...formErrors, ...documentErrors };
    setErrors(combinedErrors);

    if (isFormValid && isDocumentsValid) {
      console.log("KYC Details Submitted", formData, uploadedDocuments);
      router.push("/kyc/bankWrapper");
    }
  };

  return (
    <View className="items-center justify-center p-4 w-full">
      <View className="h-[540px] w-full p-2">
        <Text className="text-3xl my-3 font-semibold text-center">
          KYC Details
        </Text>
        <ScrollView className="p-3" persistentScrollbar={true}>
          <View className="mb-3">
            <Label nativeID="storeName" className="mb-1 text-lg font-semibold">
              Provider Store Name
            </Label>
            <Input
              className="p-2"
              placeholder="Enter Provider Store Name"
              value={storeName}
              onChangeText={setStoreName}
              aria-labelledby="storeName"
              aria-errormessage="storeNameError"
            />
            {errors.storeName ? (
              <Text className="text-red-500">{errors.storeName}</Text>
            ) : null}
          </View>
          <View className="mb-3">
            <Label
              nativeID="registeredAddress"
              className="mb-2 text-lg font-semibold"
            >
              Registered Address
            </Label>
            <Input
              className="p-2"
              placeholder="Enter Provider Registered Address"
              value={registeredAddress}
              onChangeText={setRegisteredAddress}
              aria-labelledby="registeredAddress"
              aria-errormessage="addressError"
            />
            {errors.registeredAddress ? (
              <Text className="text-red-500">{errors.registeredAddress}</Text>
            ) : null}
          </View>
          <View className="mb-3">
            <Label nativeID="email" className="mb-1 text-lg font-semibold">
              Email
            </Label>
            <Input
              className="p-2"
              placeholder="Enter Provider Email Address"
              value={email}
              onChangeText={setEmail}
              aria-labelledby="email"
              aria-errormessage="emailError"
            />
            {errors.email ? (
              <Text className="text-red-500">{errors.email}</Text>
            ) : null}
          </View>
          <View className="mb-3 ">
            <Label nativeID="mobile" className="mb-1 text-lg font-semibold">
              Mobile Number
            </Label>
            <Input
              className="p-2"
              placeholder="Enter Provider Mobile Number"
              value={mobile}
              onChangeText={setMobile}
              aria-labelledby="mobile"
              aria-errormessage="mobileError"
              keyboardType="numeric"
            />
            {errors.mobile ? (
              <Text className="text-red-500">{errors.mobile}</Text>
            ) : null}
          </View>
          <View className="mb-3 ">
            <Label nativeID="pan" className="mb-1 text-lg font-semibold">
              PAN
            </Label>
            <Input
              className="p-2"
              placeholder="Enter Provider PAN"
              value={pan}
              onChangeText={setPan}
              aria-labelledby="pan"
              aria-errormessage="panError"
            />
            {errors.pan ? (
              <Text className="text-red-500">{errors.pan}</Text>
            ) : null}
          </View>
          <View className="mb-3">
            <Label nativeID="gstin" className="mb-1 text-lg font-semibold">
              GSTIN
            </Label>
            <Input
              className="p-2"
              placeholder="Enter Provider GSTIN"
              value={gstin}
              onChangeText={setGstin}
              aria-labelledby="gstin"
              aria-errormessage="gstinError"
            />
            {errors.gstin ? (
              <Text className="text-red-500">{errors.gstin}</Text>
            ) : null}
          </View>
          <View className="mb-5">
            <Label
              nativeID="fssaiNumber"
              className="mb-1 text-lg font-semibold"
            >
              FSSAI Number
            </Label>
            <Input
              className="p-2"
              placeholder="Enter Provider FSSAI Number"
              value={fssaiNumber}
              onChangeText={setFssaiNumber}
              aria-labelledby="fssaiNumber"
              aria-errormessage="fssaiError"
            />
            {errors.fssaiNumber ? (
              <Text className="text-red-500">{errors.fssaiNumber}</Text>
            ) : null}
          </View>
          <KYCDocuments
            uploadedDocuments={uploadedDocuments}
            setUploadedDocuments={setUploadedDocuments}
            errors={errors}
          />
        </ScrollView>
      </View>
      <Button
        size="lg"
        variant="destructive"
        onPress={handleSubmit}
        className="mt-4 w-[320px] bg-blue-500 active:bg-blue-400"
      >
        <Text className="text-white font-semibold text-xl">Submit</Text>
      </Button>
    </View>
  );
};

export default KYCForm;
