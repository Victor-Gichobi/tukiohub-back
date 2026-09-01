require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet"); // Added for header security
const rateLimit = require("express-rate-limit"); // Added for DDoS protection
const dns = require("dns");

// Force Node.js to resolve SRV records through public DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const userRoutes = require("./routes/userRoutes"); // Added new user profiles route

const app = express();

// Global Security Middleware
app.use(helmet()); // Protects against XSS, Clickjacking, etc.

// Rate Limiting: Limits each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: "Too many requests from this IP, please try again later." }
});
app.use("/api/", limiter); // Applies rate limiting to all API endpoints

// CORS Configuration (Consider updating this to your frontend URL in production)
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); 
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
app.use("/api/users", userRoutes); // Integrated secure user profile routes

// Port
const PORT = process.env.PORT || 5000;

// Check MongoDB URI before connecting
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined.");
  console.error("Make sure your .env file contains:");
  console.error("MONGODB_URI=your_mongodb_connection_string");
  process.exit(1);
}

console.log("MongoDB URI loaded successfully");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    // Start server only after MongoDB connects
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  });
