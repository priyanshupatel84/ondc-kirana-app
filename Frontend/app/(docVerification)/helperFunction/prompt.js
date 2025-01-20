// prompts.js
export const prompts = {
  "Cancelled Bank Cheque": `Analyze the following text, which has been extracted from an image, and determine whether it belongs to a bank cheque. **Important:** Your response should be one of two options: If the text does not represent a bank cheque, simply respond with '[false]'. If it is a bank cheque, extract the following information and present it in an array format:\n\n1. A boolean value indicating if the text represents a bank cheque (true).\n2. The account holder's name as a string.\n3. The account number as a string.\n4. The IFSC code as a string.\n5. The bank name as a string.\n6. The branch name with address as a string.\n\n**Important:** Only two types of responses are acceptable: '[false]' for non-bank cheque documents, or an array with the specified information if it is a bank cheque. Any other responses will not be accepted.\n\n**Text to Analyze:**\n
  `,

  "PAN Card": `Analyze if the following text represents an Indian PAN (Permanent Account Number) Card.

Validation Rules:
- Must contain a 10-character PAN number format: AAAPL1234C
  (First 5 letters, followed by 4 numbers, ending with a letter)
- Should include cardholder's name
- May contain "Income Tax Department" or "Government of India" text
- Should match standard PAN card formatting

Required Response Format:
For non-PAN documents:
  Return exactly [false]

For valid PAN cards:
  Return JSON array:
  [
    true,              // Boolean: confirms valid PAN card
    "AAAPL1234C",      // String: PAN number in exact format
    "FULL NAME"        // String: Name as shown on card
  ]

Note: 
- Response must be exactly [false] OR the array format above
- No additional text or explanations
- PAN number must match the standard format
- Name should be in capital letters as shown on card

Input Text to Analyze:
`,

  "AADHAAR Card": `Analyze if this text represents an Indian Aadhaar Card. Return true if it contains key Aadhaar elements.

  Response Format:
  For valid Aadhaar (Any TWO of these conditions):
  - Contains 12-digit number
  - Has 'Aadhaar' OR 'आधार' reference
  - Shows 'Government of India' OR 'भारत सरकार'
  Return:
  [
    true,
    "xxxxxxxxxxxx",    // 12-digit number
    "NAME"            // Person's name
  ]
  
  For definitely non-Aadhaar (ALL must be true):
  - Contains "PAN" OR "TAN" OR "GST"
  - Has PAN format (ABCDE1234F)
  - Explicitly mentions "Income Tax"
  Return: [false]
  
  If in doubt, prefer returning true with extracted information.
  *IMPORTANT 
  NO EXPLANATIONS. ONLY ARRAY FORMAT:
[false] or [true,"123456789012","NAME"]
  
  Text to Analyze:
  `,
  "GSTIN Certificate": `Your task is to extract information from GST registration documents.

  KEY INFORMATION TO EXTRACT:
  1. GST Number (15-character alphanumeric code)
  2. Complete Address (including city, state, pincode)
  3. Business/Shop Name (may appear as 'Trade Name' or 'Legal Name')
  
  RESPONSE FORMAT:
  Return an array with 4 elements:
  [
    boolean,  // true if all 3 items found, false otherwise
    string | null,  // GST Number or null
    string | null,  // Full Address or null
    string | null   // Business Name or null
  ]
  
  Example valid response:
  [
    true,
    "29AAACW1234F1Z5",
    "123 Business Park, Tech City, Karnataka 560001",
    "WebTech Solutions"
  ]
  
  Example invalid/partial response:
  [
    false
  ]
  
  IMPORTANT NOTES:
  - Extract only the specified information
  - Return null for any missing fields
  - Validate GST number format (15 characters)
  - Include complete address with pincode
  - Do not modify or format the extracted text
  
  INPUT TEXT:
  `,

  "Address Proof": `
IMPORTANT: When in doubt about minor issues, prefer to ACCEPT the document rather than reject it.

VALID ADDRESS PROOF DOCUMENTS:
1. Utility Bills (Electricity/Water/Gas)
   - Accept if within 4 months (be lenient with dates)
2. Bank Statement/Passbook
   - Accept if shows recent activity
3. Rent Agreement
   - Accept if appears current/valid
4. Government IDs (Aadhaar/Passport/Voter ID/Driving License)
   - Accept unless clearly expired
5. Property Documents
   - Accept any official property document
6. Telephone/Internet Bills
   - Accept if relatively recent

VALIDATION APPROACH:
1. Address Components (accept if has MOST of these):
   - Any identifiable location number
   - Area or street identifier
   - City or district
   - State (optional)
   - PIN code (accept even if partial)

2. Document Essentials (accept if has ANY TWO):
   - Identifiable document type
   - Name
   - Date/period
   - Document identifier/number

RESPONSE FORMAT:
Return boolean:
true: If document shows reasonable evidence of address
false: Only if document is clearly invalid/fake

KEY PRINCIPLE:
- If the document appears genuine but has minor issues, return true
- Return false ONLY when you are highly confident the document is invalid

Example Scenarios - Return TRUE:
- Address missing PIN code but rest is clear
- Utility bill slightly older but clearly genuine
- Minor spelling variations in address
- Partial document number but address clear
- Unclear date but document appears official

Return FALSE only for:
- Completely missing address
- Obviously fake/tampered document
- Wrong document type (not an address proof)
- Completely illegible document like bank cheque, etc.

Response must be ONLY in array format [true] or [false].

INPUT TEXT:
`,
};
