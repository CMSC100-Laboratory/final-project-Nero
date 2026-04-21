import { Request, Response } from "express";
import Order from "../models/orderModel";
import { Types } from "mongoose";
import "../types/express.d";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const orders = await Order.find({ email: user.email });
    res.status(200).json(orders);
  } catch (_error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const { transactionId, productId, orderQuantity } = req.body as {
      transactionId: string;
      productId: Types.ObjectId;
      orderQuantity: number;
    };
    const newOrder = await Order.create({
      transactionId,
      productId,
      orderQuantity,
      orderStatus: 0,
      email: user.email,
      dateOrdered: new Date(),
    });
    res.status(200).json(newOrder);
  } catch (_error) {
    res.status(500).json({ message: "Error creating order" });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const cancelledOrders = await Order.updateMany(
      { transactionId: id, email: user.email, orderStatus: 0 },
      { $set: { orderStatus: 2 } }
    );

    if (cancelledOrders.matchedCount === 0) {
      return res.status(404).json({ message: "No orders found to cancel." });
    }
    return res.status(200).json({
      message: "Successfully cancelled order.",
    });
  } catch (_error) {
    return res.status(500).json({ message: "Error deleting product" });
  }
};
