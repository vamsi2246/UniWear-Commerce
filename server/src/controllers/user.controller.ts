import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";
import { userService } from "../services/user.service";
import { AuthRequest } from "../types";

export const userController = {
  getAll: catchAsync(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await userService.getAll(page, limit);
    ApiResponse.paginated(res, result.users, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  }),

  getById: catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await userService.getById(req.params.id as string);
    ApiResponse.success(res, user);
  }),

  updateRole: catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await userService.updateRole(req.params.id as string, req.body.role);
    ApiResponse.success(res, user, "User role updated");
  }),

  getDashboardStats: catchAsync(async (_req: AuthRequest, res: Response) => {
    const stats = await userService.getDashboardStats();
    ApiResponse.success(res, stats);
  }),
};
