const express = require("express");
const router = express.Router();
const { z } = require("zod");
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
// const User = require("../models/User"); // Adjust path to your actual User model

// 1. Zod Whitelist Schema for Text Updates
const profileUpdateSchema = z.object({
  displayName: z.string().min(2).max(30).optional(),
  bio: z.string().max(200).optional(),
}).strict(); // .strict() rejects extra data variations like role injection

// 2. Safe Multer Memory Storage Configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB file size
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG, JPG, PNG, and WEBP images are allowed!"));
  }
}).single("profilePicture");

// ==========================================
// SECURE ENDPOINTS
// ==========================================

// Endpoint for updating profile text data
router.patch("/profile", protect, async (req, res) => {
  try {
    const validatedData = profileUpdateSchema.parse(req.body);
    const userId = req.user.id; // Pulled from secure JWT token

    // Example Mongoose update excluding password from return data
    // const updatedUser = await User.findByIdAndUpdate(userId, validatedData, { new: true }).select("-password");

    res.json({ message: "Profile updated safely!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid data format", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint for secure profile picture uploads
router.post("/profile/avatar", protect, (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large. Maximum size is 2MB." });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    try {
      // req.file.buffer holds your safe image data here
      // Pass this buffer to your cloud storage SDK (S3 or Cloudinary)
      
      res.json({ message: "Profile picture uploaded safely to buffer!" });
    } catch (uploadError) {
      res.status(500).json({ error: "Failed to process image." });
    }
  });
});

module.exports = router;
