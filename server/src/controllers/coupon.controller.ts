import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";
import { couponService } from "../services/coupon.service";
import { AuthRequest } from "../types";

export const couponController = {
  validate: catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await couponService.validate(req.body.code, req.body.orderTotal);
    ApiResponse.success(res, result, "Coupon applied successfully");
  }),

  getAll: catchAsync(async (_req: AuthRequest, res: Response) => {
    const coupons = await couponService.getAll();
    ApiResponse.success(res, coupons);
  }),

  create: catchAsync(async (req: AuthRequest, res: Response) => {
    const coupon = await couponService.create(req.body);
    ApiResponse.created(res, coupon, "Coupon created successfully");
  }),

  update: catchAsync(async (req: AuthRequest, res: Response) => {
    const coupon = await couponService.update(req.params.id as string, req.body);
    ApiResponse.success(res, coupon, "Coupon updated successfully");
  }),

  delete: catchAsync(async (req: AuthRequest, res: Response) => {
    await couponService.delete(req.params.id as string);
    ApiResponse.success(res, null, "Coupon deleted successfully");
  }),
};
