const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/User");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to validate user data
const validateUserData = (data) => {
  const errors = {};

  if (!data.name || !validator.isLength(data.name, { min: 3, max: 50 })) {
    errors.nameError = "Name must be between 3 and 50 characters.";
  }
  if (!data.email || !validator.isEmail(data.email)) {
    errors.emailError = "Please enter a valid email address.";
  }
  if (!data.password || !validator.isStrongPassword(data.password)) {
    errors.passwordError =
      "Password must be strong (at least 8 characters, including uppercase, lowercase, numbers, and symbols).";
  }
  if (data.mob_no && !validator.isMobilePhone(data.mob_no, "any")) {
    errors.mobileError = "Invalid mobile number.";
  }
  if (data.photo_url && !validator.isURL(data.photo_url)) {
    errors.photoError = "Invalid photo URL.";
  }

  return errors;
};

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, mob_no, photo_url } = req.body;
    const validationErrors = validateUserData({
      name,
      email,
      password,
      mob_no,
      photo_url,
    });

    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email." });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mob_no,
      photo_url,
    });

    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = {};

    if (!email || !validator.isEmail(email)) {
      errors.emailError = "Please enter a valid email address.";
    }
    if (!password) {
      errors.passwordError = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        errors: {
          loginError: "Invalid credentials.",
        },
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "User login successful", user, token });
  } catch (error) {
    res.status(500).json({
      errors: {
        loginError: "Internal server error. Please try again later.",
      },
    });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, mob_no, photo_url } = req.body;

    const validationErrors = validateUserData({
      name,
      email,
      password,
      mob_no,
      photo_url,
    });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (mob_no) user.mob_no = mob_no;
    if (photo_url) user.photo_url = photo_url;

    await user.save();
    res.json({ message: "User updated successfully!", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Logout a user
exports.logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided." });
    }

    // Optionally blacklist the token
    // Example: Save token in a blacklist collection or cache
    // await TokenBlacklist.create({ token });

    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
