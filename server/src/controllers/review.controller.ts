import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";
import { reviewService } from "../services/review.service";
import { AuthRequest } from "../types";

export const reviewController = {
  getProductReviews: catchAsync(async (req: Request, res: Response) => {
    const reviews = await reviewService.getProductReviews(req.params.productId as string);
    ApiResponse.success(res, reviews);
  }),

  create: catchAsync(async (req: AuthRequest, res: Response) => {
    const review = await reviewService.create(
      req.user!.userId,
      req.params.productId as string,
      req.body
    );
    ApiResponse.created(res, review, "Review added successfully");
  }),

  update: catchAsync(async (req: AuthRequest, res: Response) => {
    const review = await reviewService.update(
      req.params.id as string,
      req.user!.userId,
      req.body
    );
    ApiResponse.success(res, review, "Review updated successfully");
  }),

  delete: catchAsync(async (req: AuthRequest, res: Response) => {
    await reviewService.delete(
      req.params.id as string,
      req.user!.userId,
      req.user!.role === "ADMIN"
    );
    ApiResponse.success(res, null, "Review deleted successfully");
  }),
};
