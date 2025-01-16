import { useState } from "react";
let globalVerifiedData = {};

const UseDocumentData = () => {
  const [documentData, setDocumentData] = useState([
    { CancelledBankCheque: [] },
    { PANCard: [] },
    { AADHAARCard: [] },
    { GSTINCertificate: [] },
    { AddressProof: [] },
  ]);

  const updateDocumentData = (title, response, cloudinaryUrl = undefined) => {
    setDocumentData((prevData) => {
      const newData = [...prevData];

      // Remove any undefined values from response
      const cleanResponse = response.filter((item) => item !== undefined);

      // Add cloudinaryUrl if it exists
      const finalResponse = cloudinaryUrl
        ? [...cleanResponse, cloudinaryUrl]
        : cleanResponse;

      switch (title) {
        case "Cancelled Bank Cheque":
          newData[0].CancelledBankCheque = finalResponse;
          break;
        case "PAN Card":
          newData[1].PANCard = finalResponse;
          break;
        case "AADHAAR Card":
          newData[2].AADHAARCard = finalResponse;
          break;
        case "GSTIN Certificate":
          newData[3].GSTINCertificate = finalResponse;
          break;
        case "Address Proof":
          newData[4].AddressProof = finalResponse;
          break;
      }

      return newData;
    });
  };
  //console.log("documentData", documentData);
  globalVerifiedData = documentData;
  return { documentData, updateDocumentData };
};
export const getVerifiedData = () => globalVerifiedData;
export default UseDocumentData;
