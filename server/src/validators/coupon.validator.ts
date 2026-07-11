import { z } from "zod";

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3, "Code must be at least 3 characters").max(20).toUpperCase(),
    discountPct: z.number().int().min(1).max(100, "Discount must be 1-100%"),
    minOrder: z.number().min(0).default(0),
    maxDiscount: z.number().positive().optional().nullable(),
    usageLimit: z.number().int().positive().optional().nullable(),
    expiresAt: z.string().datetime({ message: "Invalid date format" }),
  }),
});

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, "Coupon code is required"),
    orderTotal: z.number().positive("Order total must be positive"),
  }),
});
