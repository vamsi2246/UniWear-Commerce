import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";
import { orderService } from "../services/order.service";
import { AuthRequest } from "../types";

export const orderController = {
  create: catchAsync(async (req: AuthRequest, res: Response) => {
    const order = await orderService.create(req.user!.userId, req.body);
    ApiResponse.created(res, order, "Order placed successfully");
  }),

  getUserOrders: catchAsync(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await orderService.getUserOrders(req.user!.userId, page, limit);
    ApiResponse.paginated(res, result.orders, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  }),

  getOrderById: catchAsync(async (req: AuthRequest, res: Response) => {
    const order = await orderService.getOrderById(
      req.params.id as string,
      req.user!.userId,
      req.user!.role === "ADMIN"
    );
    ApiResponse.success(res, order);
  }),

  getAllOrders: catchAsync(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await orderService.getAllOrders(page, limit);
    ApiResponse.paginated(res, result.orders, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  }),

  updateStatus: catchAsync(async (req: AuthRequest, res: Response) => {
    const order = await orderService.updateStatus(req.params.id as string, req.body.status);
    ApiResponse.success(res, order, "Order status updated");
  }),
};
