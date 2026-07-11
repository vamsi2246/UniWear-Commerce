import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1, "Rating must be 1-5").max(5, "Rating must be 1-5"),
    comment: z.string().max(1000).optional(),
  }),
  params: z.object({
    productId: z.string().min(1),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().max(1000).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
