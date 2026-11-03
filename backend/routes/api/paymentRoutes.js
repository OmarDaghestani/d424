import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
} from "../../controllers/paymentController.js";
import protect from "../../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes for the checkout page
router.post("/create-payment-intent", protect, createPaymentIntent);
router.post("/confirm", protect, confirmPayment);

// Webhook route for handling Stripe events (raw body is set up in server.js)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

export default router;
