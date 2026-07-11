import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";
import { cartService } from "../services/cart.service";
import { AuthRequest } from "../types";

export const cartController = {
  getCart: catchAsync(async (req: AuthRequest, res: Response) => {
    const cart = await cartService.getCart(req.user!.userId);
    ApiResponse.success(res, cart);
  }),

  addItem: catchAsync(async (req: AuthRequest, res: Response) => {
    const cart = await cartService.addItem(req.user!.userId, req.body);
    ApiResponse.success(res, cart, "Item added to cart");
  }),

  updateItem: catchAsync(async (req: AuthRequest, res: Response) => {
    const cart = await cartService.updateItem(
      req.user!.userId,
      req.params.id as string,
      req.body.quantity
    );
    ApiResponse.success(res, cart, "Cart updated");
  }),

  removeItem: catchAsync(async (req: AuthRequest, res: Response) => {
    const cart = await cartService.removeItem(req.user!.userId, req.params.id as string);
    ApiResponse.success(res, cart, "Item removed from cart");
  }),

  clearCart: catchAsync(async (req: AuthRequest, res: Response) => {
    await cartService.clearCart(req.user!.userId);
    ApiResponse.success(res, null, "Cart cleared");
  }),
};
