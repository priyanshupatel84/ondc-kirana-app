const express = require("express");
const userHandler = require("./routes/userHandler");
const shopHandler = require("./routes/shopHandler");
const KYCHandler = require("./routes/KYCHandler");
const bankHandler = require("./routes/bankHandler");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Use CORS middleware
app.use(cors());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userHandler);
app.use("/api/shops", shopHandler);
app.use("/api/kyc", KYCHandler);
app.use("/api/bank-account", bankHandler);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: "ONDC-Seller-App", // Specify the database name here
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server after successful database connection
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
