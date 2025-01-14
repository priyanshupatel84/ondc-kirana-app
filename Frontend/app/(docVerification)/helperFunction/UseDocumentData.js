import { useState } from "react";
let globalVerifiedData = {};

const UseDocumentData = () => {
  const [documentData, setDocumentData] = useState([
    { CancelledBankCheque: [] },
    { PANCard: [] },
    { IDCard: [] },
    { GSTINCertificate: [] },
    { AddressProof: [] },
  ]);

  const updateDocumentData = (title, response, base64Image) => {
    setDocumentData((prevData) => {
      const newData = [...prevData];
      switch (title) {
        case "Cancelled Bank Cheque":
          newData[0].CancelledBankCheque = [...response];
          newData[0].CancelledBankCheque[6] = base64Image;
          break;
        case "PAN Card":
          newData[1].PANCard = [...response];
          newData[1].PANCard[3] = base64Image;
          break;
        case "ID Card":
          newData[2].IDCard = [...response];
          newData[2].IDCard[1] = base64Image;
          break;
        case "GSTIN Certificate":
          newData[3].GSTINCertificate = [...response];
          newData[3].GSTINCertificate[4] = base64Image;
          break;
        case "Address Proof":
          newData[4].AddressProof = [...response];
          newData[4].AddressProof[1] = base64Image;
          break;
        default:
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
