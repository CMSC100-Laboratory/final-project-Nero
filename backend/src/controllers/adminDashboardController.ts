import { Request, Response } from "express";
import User from "../models/userModel";
import Order from "../models/orderModel";
import Product from "../models/productModel";
import mongoose from "mongoose";

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

// Update a user's details or role.
export const updateUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { firstname, middlename, lastname, email, userType } = req.body as {
      firstname?: string;
      middlename?: string;
      lastname?: string;
      email?: string;
      userType?: "admin" | "user";
    };

    // If demoting this admin, make sure at least one other admin remains.
    if (userType === "user" && user.userType === "admin") {
      const adminCount = await User.countDocuments({ userType: "admin" });
      if (adminCount <= 1) {
        res.status(400).json({ message: "Cannot demote the last remaining admin" });
        return;
      }
    }

    if (firstname !== undefined) user.firstname = firstname;
    if (middlename !== undefined) user.middlename = middlename;
    if (lastname !== undefined) user.lastname = lastname;
    if (email !== undefined) user.email = email;
    if (userType !== undefined) user.userType = userType;

    await user.save();

    const updatedUser = await User.findById(id).select("-password");
    res.status(200).json(updatedUser);
  } catch (_error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete a user account.
export const deleteUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Prevent an admin from deleting their own account.
    if (req.user && req.user._id.toString() === id) {
      res.status(400).json({ message: "You cannot delete your own account" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Prevent deletion of the last remaining admin.
    if (user.userType === "admin") {
      const adminCount = await User.countDocuments({ userType: "admin" });
      if (adminCount <= 1) {
        res.status(400).json({ message: "Cannot delete the last remaining admin" });
        return;
      }
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (_error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
