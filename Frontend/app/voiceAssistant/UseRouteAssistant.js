import { useTranslation } from "react-i18next";

const UseRouteAssistant = () => {
  const { t } = useTranslation();

  // Define the route texts using the translation function
  const routeText = {
    index: t("Welcome to the home screen."),
    home: t("You are on the home page"),
    profile: t("You are viewing your profile."),
    anotherComponent: t("Welcome to ONDC, Please choose a language"),
  };

  return routeText;
};

export default UseRouteAssistant;
