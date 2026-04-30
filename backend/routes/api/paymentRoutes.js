import express from "express";
import {
  createPaymentIntent,
  handleWebhook,
} from "../../controllers/paymentController.js";
import protect from "../../middleware/authMiddleware.js";

const router = express.Router();

// Protected route for creating payment intent
router.post("/create-payment-intent", protect, createPaymentIntent);

// Webhook route for handling Stripe events
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

export default router;
