import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
} from "../controllers/productController";
import { validate } from "../middleware/validateResource";
import { createProductSchema, updateProductSchema } from "../schemas/productSchema";

const router = express.Router();

//GET /api/products
router.get("/", protect, getProducts);
//POST /api/products
router.post("/", protect, adminOnly, validate(createProductSchema), createProduct);
//PUT /api/products/:id
router.put("/:id", protect, adminOnly, validate(updateProductSchema), editProduct);
//DELETE /api/products/:id
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
