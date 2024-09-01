const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const certificateRoute = require("./routes/certificates");
const authMiddleware = require("./middleware/AuthMiddleware");

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors({ origin: true, credentials: true }));

// Middleware to parse JSON requests
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", certificateRoute);

app.post("/verify", authMiddleware, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
