/* global __APP_API_URL__, __APP_STRIPE_PK__ */

const fromViteDefine =
  typeof __APP_API_URL__ !== "undefined" ? __APP_API_URL__ : "";

export const API_URL =
  (fromViteDefine && String(fromViteDefine)) ||
  (typeof process !== "undefined" && process.env.VITE_API_URL) ||
  "http://localhost:5000";

// Empty when payments aren't configured; the checkout page shows a notice instead
export const STRIPE_PUBLISHABLE_KEY =
  (typeof __APP_STRIPE_PK__ !== "undefined" && __APP_STRIPE_PK__) ||
  (typeof process !== "undefined" && process.env.VITE_STRIPE_PUBLISHABLE_KEY) ||
  "";
