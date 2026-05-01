import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
} from "../controllers/productController";
import { upload } from "../config/cloudinary";

const router = express.Router();

//GET /api/products
router.get("/", protect, getProducts);
//POST /api/products
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
//PUT /api/products/:id
router.put("/:id", protect, adminOnly, upload.single("image"), editProduct);
//DELETE /api/products/:id
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
