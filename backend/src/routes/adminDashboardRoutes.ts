import express from "express";
import { users, orders, confirm, sales } from "../controllers/adminDashboardController";

const router = express.Router();

// POST /api/admin/users
router.post("/users", users);

// POST /api/admin/orders
router.post("/orders", orders);

// POST /api/admin/:id/confirm
router.post("/:id/confirm", confirm);

// POST /api/admin/sales
router.post("/sales", sales);

export default router;
