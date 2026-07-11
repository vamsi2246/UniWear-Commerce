import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(200),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().positive("Price must be positive"),
    comparePrice: z.number().positive().optional().nullable(),
    images: z.array(z.string().url()).min(1, "At least one image is required"),
    sizes: z.array(z.string()).default([]),
    colors: z.array(z.string()).default([]),
    stock: z.number().int().min(0, "Stock cannot be negative"),
    categoryId: z.string().min(1, "Category is required"),
    isFeatured: z.boolean().default(false),
    isArchived: z.boolean().default(false),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    comparePrice: z.number().positive().optional().nullable(),
    images: z.array(z.string().url()).optional(),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    stock: z.number().int().min(0).optional(),
    categoryId: z.string().optional(),
    isFeatured: z.boolean().optional(),
    isArchived: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
