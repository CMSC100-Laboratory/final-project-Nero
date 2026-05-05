import { Request, Response } from "express";
import Order from "../models/orderModel";
import Product from "../models/productModel";

interface CreateOrderBody {
  transactionId: string;
  productId: string;
  orderQuantity: number;
}

// gets orders of the current user
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    // checks if user is authenticated
    if (!user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    // gets all orders of the current user and populates the productId field
    const orders = await Order.find({ email: user.email })
      .populate("productId")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (_error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// creates an order
export const createOrder = async (
  req: Request<never, never, CreateOrderBody>,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;
    // checks if user is authenticated
    if (!user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const { transactionId, productId, orderQuantity } = req.body;

    // Validate that the product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    // checks if there is enough stock
    if (product.quantity < orderQuantity) {
      res.status(400).json({
        message: `Insufficient stock. Only ${product.quantity} units available.`,
      });
      return;
    }

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

// cancels an order
export const cancelOrder = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;
    // checks if user is authenticated
    if (!user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    // updates the status of the order to cancelled (2)
    const cancelledOrders = await Order.updateMany(
      { transactionId: id, email: user.email, orderStatus: 0 },
      { $set: { orderStatus: 2 } }
    );

    // checks if there are orders to cancel
    if (cancelledOrders.matchedCount === 0) {
      res.status(404).json({ message: "No pending orders found with this transaction ID." });
      return;
    }

    res.status(200).json({ message: "Successfully cancelled order." });
  } catch (_error) {
    res.status(500).json({ message: "Error cancelling order" });
  }
};
