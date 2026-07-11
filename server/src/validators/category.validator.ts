import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    description: z.string().optional(),
    image: z.string().url().optional().nullable(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().optional().nullable(),
    image: z.string().url().optional().nullable(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
