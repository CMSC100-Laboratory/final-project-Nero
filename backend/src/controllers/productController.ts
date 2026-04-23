import { Request, Response } from "express";
import Product from "../models/productModel";

interface ProductBody {
  productName: string;
  description: string;
  productType: 1 | 2;
  quantity: number;
  price: number;
}

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (_error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const createProduct = async (
  req: Request<never, never, ProductBody>,
  res: Response
): Promise<void> => {
  try {
    const { productName, description, productType, quantity, price } = req.body;

    const newProduct = await Product.create({
      productName,
      description,
      productType,
      quantity,
      price,
    });

    res.status(201).json(newProduct);
  } catch (_error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

export const editProduct = async (
  req: Request<{ id: string }, never, Partial<ProductBody>>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { productName, description, productType, quantity, price } = req.body;

    const updateData: Partial<ProductBody> = {};
    if (productName !== undefined) updateData.productName = productName;
    if (description !== undefined) updateData.description = description;
    if (productType !== undefined) updateData.productType = productType;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (price !== undefined) updateData.price = price;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    res.status(200).json(updatedProduct);
  } catch (_error) {
    res.status(500).json({ message: "Error editing product" });
  }
};

export const deleteProduct = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (_error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
