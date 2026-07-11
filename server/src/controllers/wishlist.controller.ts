import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";
import { wishlistService } from "../services/wishlist.service";
import { AuthRequest } from "../types";

export const wishlistController = {
  getWishlist: catchAsync(async (req: AuthRequest, res: Response) => {
    const items = await wishlistService.getWishlist(req.user!.userId);
    ApiResponse.success(res, items);
  }),

  addToWishlist: catchAsync(async (req: AuthRequest, res: Response) => {
    const item = await wishlistService.addToWishlist(
      req.user!.userId,
      req.params.productId as string
    );
    ApiResponse.created(res, item, "Added to wishlist");
  }),

  removeFromWishlist: catchAsync(async (req: AuthRequest, res: Response) => {
    await wishlistService.removeFromWishlist(
      req.user!.userId,
      req.params.productId as string
    );
    ApiResponse.success(res, null, "Removed from wishlist");
  }),
};
