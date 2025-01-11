import { useEffect, useState } from "react";
let globalVerifiedData = {};

const UseVerifiedDocumentsData = (documents) => {
  const [verifiedData, setVerifiedData] = useState({});

  useEffect(() => {
    const parsedDocuments = documents ? JSON.parse(documents) : [];

    const newVerifiedData = {};

    parsedDocuments.forEach((doc) => {
      const { documentType, info } = doc;

      switch (documentType) {
        case "Cancelled Bank Cheque":
          newVerifiedData.cancelledCheque = {
            isValid: info[0],
            accountHolderNumber: info[1],
            accountNumbere: info[2],
            ifscCode: info[3],
            brankName: info[4],
            branchAddress: info[5],
          };
          break;
        case "PAN Card":
          newVerifiedData.panCard = {
            isValid: info[0],
            panNumber: info[1],
            panHolderName: info[2],
          };
          break;
        case "ID Card":
          newVerifiedData.idCard = {
            name: info[0],
            idNumber: info[1],
          };
          break;
        case "GSTIN Certificate":
          newVerifiedData.gstinCertificate = {
            gstin: info[0],
          };
          break;
        case "Address Proof":
          newVerifiedData.addressProof = {
            address: info[0],
          };
          break;
        default:
          break;
      }
    });
    globalVerifiedData = newVerifiedData;
    //console.log(newVerifiedData);
    setVerifiedData(newVerifiedData);
  }, [documents]);

  return verifiedData;
};
export const getVerifiedData = () => globalVerifiedData;
export default UseVerifiedDocumentsData;
