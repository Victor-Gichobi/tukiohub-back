require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Force Node.js to resolve SRV records through public DNS
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Event Management API iko fiti kabisaaaaaaaa!!!",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// Port
const PORT = process.env.PORT || 5000;

// Check MongoDB URI before connecting
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined.");
  console.error("Make sure your .env file contains:");
  console.error("MONGODB_URI=your_mongodb_connection_string");
  process.exit(1);
}

// Show that the variable exists
console.log("MongoDB URI loaded successfully");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(" MongoDB connected successfully");

    // Start server only after MongoDB connects
    app.listen(PORT,  "0.0.0.0" ,() => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  });

