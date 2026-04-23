import { Request, Response } from "express";
import Order from "../models/orderModel";

interface CreateOrderBody {
  transactionId: string;
  productId: string;
  orderQuantity: number;
}

export const getOrders = async (req: Request, res: Response): Promise<void> => {
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

export const createOrder = async (
  req: Request<never, never, CreateOrderBody>,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const { transactionId, productId, orderQuantity } = req.body;

    const newOrder = await Order.create({
      transactionId,
      productId,
      orderQuantity,
      orderStatus: 0,
      email: user.email,
      dateOrdered: new Date(),
    });

    res.status(201).json(newOrder);
  } catch (_error) {
    res.status(500).json({ message: "Error creating order" });
  }
};

export const cancelOrder = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const cancelledOrders = await Order.updateMany(
      { transactionId: id, email: user.email, orderStatus: 0 },
      { $set: { orderStatus: 2 } }
    );

    if (cancelledOrders.matchedCount === 0) {
      res.status(404).json({ message: "No pending orders found with this transaction ID." });
      return;
    }

    res.status(200).json({ message: "Successfully cancelled order." });
  } catch (_error) {
    res.status(500).json({ message: "Error cancelling order" });
  }
};
