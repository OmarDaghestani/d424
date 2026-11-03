import axios from "axios";

import { API_URL } from "../config.js";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Starts (or resumes) card payment for an order; returns { clientSecret, amount }
export const createPaymentIntent = async (orderId) => {
  const { data } = await axios.post(
    `${API_URL}/api/payments/create-payment-intent`,
    { orderId },
    authHeaders()
  );
  return data;
};

// Asks the server to verify the payment with Stripe and mark the order paid
export const confirmPayment = async (orderId) => {
  const { data } = await axios.post(
    `${API_URL}/api/payments/confirm`,
    { orderId },
    authHeaders()
  );
  return data;
};
