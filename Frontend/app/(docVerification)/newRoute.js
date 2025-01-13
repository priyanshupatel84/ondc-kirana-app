// import React from "react";
// import { View, Text, ScrollView } from "react-native";
// import { getVerifiedData } from "./UseDocumentData";

// const DocumentDataDisplay = () => {
//   const documentData = getVerifiedData(); // custom hook to get data
//   //console.log(documentData);

//   return (
//     <ScrollView>
//       <View style={{ padding: 20 }}>
//         <Text style={{ fontSize: 24, fontWeight: "bold" }}>Document Data</Text>
//         {documentData.map((doc, index) => {
//           const docType = Object.keys(doc)[0];
//           return (
//             <View key={index} style={{ marginVertical: 10 }}>
//               <Text style={{ fontSize: 18 }}>{docType}:</Text>
//               <Text>{JSON.stringify(doc[docType])}</Text>
//             </View>
//           );
//         })}
//       </View>
//     </ScrollView>
//   );
// };

// export default DocumentDataDisplay;
