import { Request, Response } from "express";
import Product from "../models/productModel";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (_error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { productName, description, productType, quantity, price } = req.body as {
      productName: string;
      description: string;
      productType: 1 | 2 | undefined;
      quantity: number;
      price: number;
    };
    const newProduct = await Product.create({
      productName,
      description,
      productType,
      quantity,
      price,
    });
    res.status(200).json(newProduct);
  } catch (_error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.status(200).json(updatedProduct);
  } catch (_error) {
    return res.status(500).json({ message: "Error editing product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (_error) {
    return res.status(500).json({ message: "Error deleting product" });
  }
};
