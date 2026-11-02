import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
} from "../../controllers/orderController.js";
import protect from "../../middleware/authMiddleware.js";
import admin from "../../middleware/adminMiddleware.js";

const router = express.Router();

// User Routes
router.post("/", protect, createOrder); // Create an order
router.get("/my-orders", protect, getMyOrders); // Get logged-in user's orders

// Admin Routes
router.get("/", protect, admin, getAllOrders);

export default router;
