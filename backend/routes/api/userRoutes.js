import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../../controllers/userController.js";
import protect from "../../middleware/authMiddleware.js";

const router = express.Router();

// Protected Routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUserProfile);

export default router;
