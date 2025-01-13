const messages = (t) => ({
  // User Input Validation Error Messages
  inputValidationErrors: {
    nameRequired: t("Name is required"),
    invalidEmail: t("Please enter a valid email address."),
    invalidMobile: t("Please enter a valid 10-digit mobile number."),
    weakPassword: t(
      "Password must be strong (at least 8 characters, including uppercase, lowercase, numbers, and symbols)."
    ),
    internalServerError: t("Internal server error. Please try again later."),
    unexpectedError: t("An unexpected error occurred. Please try again."),
  },

  // Field-Specific Error Messages
  fieldErrors: {
    nameNotInEnglish: t("Please enter the name in English."),
    emailNotInEnglish: t("Please enter the email in English."),
    mobileNotInEnglish: t("Please enter the mobile number in English."),
    passwordNotInEnglish: t("Password must be in English."),
  },

  successMessages: {
    registrationSuccess: t("Registration successful! You can now log in."),
  },

  // UI Text Labels (Used in the Form)
  formLabels: {
    name: t("Full Name"),
    mobile: t("Mobile Number"),
    email: t("Email"),
    password: t("Password"),
    alreadyHaveAccount: t("Already have an account?"),
    login: t("Login"),
    register: t("Register"),
  },
  formPlaceholder: {
    name: "Full Name",
    mobile: "Mobile Number",
    email: "Email",
    password: "Password",
    alreadyHaveAccount: "Already have an account?",
    login: "Login",
    register: "Register",
  },
});

export default messages;
