import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getOrders, createOrder, cancelOrder } from "../controllers/orderController";

const router = express.Router();

//GET /api/orders/mine
router.get("/mine", protect, getOrders);
//POST /api/orders
router.post("/", protect, createOrder);
//PUT /api/orders/:id/cancel
router.put("/:id/cancel", protect, cancelOrder);

export default router;
