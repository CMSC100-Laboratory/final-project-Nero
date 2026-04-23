import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    transactionId: z.string().nonempty("Transaction ID is required"),
    productId: z.string().nonempty("Product ID is required"),
    orderQuantity: z.number().int().positive("Quantity must be a positive integer"),
  }),
});
