import { Request, Response } from "express";
import Order from "../models/orderModel";
import { IUserSafe } from "../models/userModel";
import { Types } from "mongoose";

interface AuthRequest extends Request {
  user?: IUserSafe;
}

export const getOrders = async (req: AuthRequest, res: Response) => {
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

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { transactionId, productId, orderQuantity, email, dateOrdered } = req.body as {
      transactionId: string;
      productId: Types.ObjectId;
      orderQuantity: number;
      email: string;
      dateOrdered: Date;
    };
    const newOrder = await Order.create({
      transactionId,
      productId,
      orderQuantity,
      orderStatus: 0,
      email,
      dateOrdered,
    });
    res.status(200).json(newOrder);
  } catch (_error) {
    res.status(500).json({ message: "Error creating order" });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const cancelledOrders = await Order.updateMany(
      { transactionId: id, email: user.email },
      { $set: { orderStatus: 2 } }
    );

    if (cancelledOrders.matchedCount === 0) {
      return res.status(404).json({ message: "No orders found to cancel." });
      return;
    }
    return res.status(200).json({
      message: "Successfully cancelled order.",
    });
  } catch (_error) {
    return res.status(500).json({ message: "Error deleting product" });
  }
};
