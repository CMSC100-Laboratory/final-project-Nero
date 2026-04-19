import { Request, Response } from "express";
import User from "../models/userModel";
import Order from "../models/orderModel";
import Product from "../models/productModel";

// Fetch all registered users and the total count.
export const users = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Fetch all orders from all users.
export const orders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Confirm an order and decrease the product inventory quantity.
export const confirm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const product = await Product.findById(order.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.quantity -= order.orderQuantity;
    await product.save();
    order.orderStatus = 1;
    await order.save();
    res.status(200).json({ message: "Order confirmed" });
  } catch (error) {
    res.status(500).json({ message: "Error confirming order" });
  }
};

// Fetch sales report data.
export const sales = async (req: Request, res: Response) => {
  try {
    const sales = await Order.find();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales" });
  }
};
