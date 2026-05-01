import express from "express";
import {
  users,
  orders,
  confirm,
  complete,
  adminCancelOrder,
  sales,
  updateUser,
  deleteUser,
} from "../controllers/adminDashboardController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/admin/users
router.get("/users", protect, adminOnly, users);

// GET /api/admin/orders
router.get("/orders", protect, adminOnly, orders);

// PUT /api/admin/orders/:id/confirm
router.put("/orders/:id/confirm", protect, adminOnly, confirm);

// PUT /api/admin/orders/:id/complete
router.put("/orders/:id/complete", protect, adminOnly, complete);

// PUT /api/admin/orders/:id/cancel
router.put("/orders/:id/cancel", protect, adminOnly, adminCancelOrder);

// GET /api/admin/sales
router.get("/sales", protect, adminOnly, sales);

// PUT /api/admin/users/:id
router.put("/users/:id", protect, adminOnly, updateUser);

// DELETE /api/admin/users/:id
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
