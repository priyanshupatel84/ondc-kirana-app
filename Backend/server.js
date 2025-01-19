const express = require("express");
const userHandler = require("./routes/userHandler");
const shopHandler = require("./routes/shopHandler");
const KYCHandler = require("./routes/KYCHandler");
const bankHandler = require("./routes/bankHandler");
const productHandler = require("./routes/productHandler");

const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/product", productHandler);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: "ONDC-Seller-App",
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
