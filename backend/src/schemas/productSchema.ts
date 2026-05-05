import { z } from "zod";

// NOTE: Product routes use multer (multipart/form-data), so numeric fields
// arrive as strings. z.coerce.number() handles the string-to-number conversion.

// validates the create product request body
export const createProductSchema = z.object({
  body: z.object({
    productName: z.string().nonempty("Product name is required"),
    description: z.string().nonempty("Description is required"),
    productType: z.coerce
      .number()
      .int()
      .refine((v) => v === 1 || v === 2, {
        message: "Product type must be 1 (Crops) or 2 (Poultry)",
      }),
    quantity: z.coerce.number().int().nonnegative("Quantity must be a non-negative integer"),
    price: z.coerce.number().nonnegative("Price must be a non-negative number"),
  }),
});

// validates the update product request body
export const updateProductSchema = z.object({
  body: z.object({
    productName: z.string().nonempty("Product name is required").optional(),
    description: z.string().nonempty("Description is required").optional(),
    productType: z.coerce
      .number()
      .int()
      .refine((v) => v === 1 || v === 2, {
        message: "Product type must be 1 (Crops) or 2 (Poultry)",
      })
      .optional(),
    quantity: z.coerce
      .number()
      .int()
      .nonnegative("Quantity must be a non-negative integer")
      .optional(),
    price: z.coerce.number().nonnegative("Price must be a non-negative number").optional(),
  }),
  params: z.object({
    id: z.string().nonempty("Product ID is required"),
  }),
});
