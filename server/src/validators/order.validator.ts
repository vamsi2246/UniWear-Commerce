import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    shipping: z.object({
      name: z.string().min(2, "Name is required"),
      address: z.string().min(5, "Address is required"),
      city: z.string().min(2, "City is required"),
      state: z.string().min(2, "State is required"),
      zip: z.string().min(4, "ZIP code is required"),
      phone: z.string().min(10, "Phone number is required"),
    }),
    couponCode: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
