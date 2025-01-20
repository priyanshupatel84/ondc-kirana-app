import { useTranslation } from "react-i18next";

const UseRouteAssistant = () => {
  const { t } = useTranslation();

  const routeText = {
    login: t(
      "If you already have an account, enter your email and password. If you're a new user, click on 'Register' to create your account."
    ),
    register: t(
      "Enter your details to create an account. If you already have an account, click on 'Login'"
    ),
    docVerificationIndex: t(
      "Congrulation you loggged to ONDC succesfully Now, You'll need to upload several important documents here. Make sure you have clear photos of you documents. Click on repective icon to upload the document."
    ),
    bankDetails: t(
      "Please verify your bank details. You will receive customer payments in this account. After verification, click on the checkbox and Submit Details."
    ),
    kycDetails: t(
      "Please verify and fill your KYC details. This is a mandatory step to ensure the security of your account. After verification, click on the checkbox and Submit."
    ),
    shopDetailsIndex: t(
      "Please fill in your shop details. This information will be displayed to customers. After filling in the details, click on Submit."
    ),
    configureStore: t(
      "Please configure your shop. You can add categories, and manage your shop settings here, after configuring your shop click on Save Configuration."
    ),
    updateShop: t("You can update your shop settings here."),

    home: t(
      "Welcome to your dashboard!. Here you can manage your shop, view orders, add products to your inventory, and access all features of the application by clicking on the respective buttons"
    ),
    order: t(
      "Here you can view all your orders and their status. Click on 'Mark as Shipped' when you have shipped the product from your shop."
    ),
    profile: t(
      "Here you can view and edit your profile details, such as bank details, KYC details, and shop details."
    ),
    inventoryIndex: t(
      "In inventory, you can see all the products added by you. These products are visible to customers for purchase. You can edit or delete existing products."
    ),
    complaintsIndex: t(
      "Here you can view all the complaints raised by customers."
    ),
    returnIndex: t(
      "In Returns, you can view all the items that have been returned by customers, along with details of each return."
    ),
    catalogIndex: t(
      "Here you need to select the category of the product you want to add to your inventory"
    ),
    product: t(
      "Please, Upload the images of the product you want to add to your inventory. Make sure the 4th image shows the back side of the product. This image will be used for auto-filling your product details."
    ),
    productEdit: t(
      "You can edit the details of the product here. Make sure to click on 'Save' after editing the details."
    ),
    chatBot: t(
      "You can chat with our chatbot here. It will assist and help you with queries related to the application."
    ),
    tutorial: t(
      "You can view the tutorial here. It will guide you through the features of the application."
    ),
    updateBankDetails: t(
      "You can update your bank details here. After changing the details, click on 'Update Details'."
    ),
    getBankDetails: t(
      "These are your bank details. If you want to update them, go back to Profile and click on the Edit button."
    ),
    getKYCDetails: t(
      "These are your KYC details that you submitted during registration."
    ),
    getShopDetails: t(
      "These are your shop details. If you want to update them, go to Home Page and click on shop Settings."
    ),
  };

  return routeText;
};

export default UseRouteAssistant;
