import { Request, Response } from "express";
import User from "../models/userModel";
import Order from "../models/orderModel";
import Product from "../models/productModel";

// Fetch all registered users.
export const users = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (_error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Fetch all orders from all users.
export const orders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (_error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Confirm an order and decrease the product inventory quantity.
export const confirm = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    if (order.orderStatus !== 0) {
      res.status(400).json({ message: "Order already processed" });
      return;
    }

    const product = await Product.findById(order.productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (product.quantity < order.orderQuantity) {
      res.status(400).json({ message: "Insufficient stock" });
      return;
    }

    product.quantity -= order.orderQuantity;
    await product.save();

    order.orderStatus = 1;
    await order.save();

    res.status(200).json({ message: "Order confirmed" });
  } catch (_error) {
    res.status(500).json({ message: "Error confirming order" });
  }
};

// Fetch sales report data (only confirmed orders).
export const sales = async (req: Request, res: Response): Promise<void> => {
  try {
    const confirmedSales = await Order.find({ orderStatus: 1 }).sort({ createdAt: -1 });
    res.status(200).json(confirmedSales);
  } catch (_error) {
    res.status(500).json({ message: "Error fetching sales" });
  }
};
