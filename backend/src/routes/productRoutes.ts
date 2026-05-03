import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
} from "../controllers/productController";
import { upload } from "../config/cloudinary";
import { validate } from "../middleware/validateResource";
import { createProductSchema, updateProductSchema } from "../schemas/productSchema";

const router = express.Router();

//GET /api/products
router.get("/", protect, getProducts);
//POST /api/products — validate AFTER multer parses the multipart body
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  validate(createProductSchema),
  createProduct
);
//PUT /api/products/:id
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  validate(updateProductSchema),
  editProduct
);
//DELETE /api/products/:id
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
