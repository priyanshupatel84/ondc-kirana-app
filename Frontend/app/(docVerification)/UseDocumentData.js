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

  const updateDocumentData = (title, response) => {
    setDocumentData((prevData) => {
      const newData = [...prevData];
      switch (title) {
        case "Cancelled Bank Cheque":
          newData[0].CancelledBankCheque = [...response];
          break;
        case "PAN Card":
          newData[1].PANCard = [...response];
          break;
        case "ID Card":
          newData[2].IDCard = [...response];
          break;
        case "GSTIN Certificate":
          newData[3].GSTINCertificate = [...response];
          break;
        case "Address Proof":
          newData[4].AddressProof = [...response];
          break;
        default:
          break;
      }
      return newData;
    });
  };
  globalVerifiedData = documentData;
  return { documentData, updateDocumentData };
};
export const getVerifiedData = () => globalVerifiedData;
export default UseDocumentData;
