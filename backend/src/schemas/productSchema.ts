import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    productName: z.string().nonempty("Product name is required"),
    description: z.string().nonempty("Description is required"),
    productType: z.union([z.literal(1), z.literal(2)]),
    quantity: z.number().nonnegative("Quantity must be a non-negative number"),
    price: z.number().nonnegative("Price must be a non-negative number"),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    productName: z.string().nonempty("Product name is required").optional(),
    description: z.string().nonempty("Description is required").optional(),
    productType: z.union([z.literal(1), z.literal(2)]).optional(),
    quantity: z.number().nonnegative("Quantity must be a non-negative number").optional(),
    price: z.number().nonnegative("Price must be a non-negative number").optional(),
  }),
  params: z.object({
    id: z.string().nonempty("Product ID is required"),
  }),
});
