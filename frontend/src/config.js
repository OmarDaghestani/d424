/* global __APP_API_URL__ */

const fromViteDefine =
  typeof __APP_API_URL__ !== "undefined" ? __APP_API_URL__ : "";

export const API_URL =
  (fromViteDefine && String(fromViteDefine)) ||
  (typeof process !== "undefined" && process.env.VITE_API_URL) ||
  "http://localhost:5000";
