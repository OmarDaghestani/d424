import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

let client = null;

// Lazily create the Stripe client so the API still boots (and returns a clear
// 503 from payment routes) when STRIPE_SECRET_KEY isn't configured.
// STRIPE_API_HOST/PORT/PROTOCOL let tests point at a local fake Stripe.
export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      ...(process.env.STRIPE_API_HOST && {
        host: process.env.STRIPE_API_HOST,
        port: Number(process.env.STRIPE_API_PORT) || 443,
        protocol: process.env.STRIPE_API_PROTOCOL || "https",
      }),
    });
  }
  return client;
};
