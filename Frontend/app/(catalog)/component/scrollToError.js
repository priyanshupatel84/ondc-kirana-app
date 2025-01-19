// utils/scrollUtils.js
import { Platform } from "react-native";

export const scrollToError = (fieldName, fieldRefs, scrollViewRef) => {
  // Check if refs exist
  if (!fieldRefs?.current?.[fieldName] || !scrollViewRef?.current) {
    console.log("Missing refs for scroll:", {
      fieldName,
      hasFieldRef: !!fieldRefs?.current?.[fieldName],
      hasScrollRef: !!scrollViewRef?.current,
    });
    return;
  }

  // Add slight delay to ensure layout is complete
  setTimeout(() => {
    try {
      // Get the correct node method based on platform
      const getNode = Platform.select({
        ios: () => scrollViewRef.current.getInnerViewNode(),
        android: () => scrollViewRef.current.getNativeScrollRef(),
        default: () => scrollViewRef.current,
      });

      const scrollNode = getNode();

      fieldRefs.current[fieldName].measureLayout(
        scrollNode,
        (x, y) => {
          console.log("Scrolling to position:", y);
          scrollViewRef.current.scrollTo({
            y: Math.max(0, y - 120), // Scroll to show field with padding
            animated: true,
          });
        },
        (error) => {
          console.error("Error measuring layout:", error);
        }
      );
    } catch (error) {
      console.error("Error in scrollToError:", error);
    }
  }, 100);
};
