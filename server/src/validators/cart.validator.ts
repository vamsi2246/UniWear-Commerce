import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
    size: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
