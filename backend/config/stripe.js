import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

let client = null;

// This store is a portfolio demo and must never take real money, so only
// Stripe test-mode keys (sk_test_ / rk_test_) are accepted.
const isTestKey = (key) => /^(sk|rk)_test_/.test(key);

if (process.env.STRIPE_SECRET_KEY && !isTestKey(process.env.STRIPE_SECRET_KEY)) {
  console.error("STRIPE_SECRET_KEY is not a test-mode key; payments are disabled (demo store).");
}

// Lazily create the Stripe client so the API still boots (and returns a clear
// 503 from payment routes) when no usable key is configured.
// STRIPE_API_HOST/PORT/PROTOCOL let tests point at a local fake Stripe.
export const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !isTestKey(key)) return null;
  if (!client) {
    client = new Stripe(key, {
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
