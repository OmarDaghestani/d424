import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductData
} from "../../controllers/productController.js";
import protect from "../../middleware/authMiddleware.js";
import admin from "../../middleware/adminMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin Routes
router.post("/", protect, admin, createProduct);
router.post("/update-data", protect, admin, updateProductData);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
