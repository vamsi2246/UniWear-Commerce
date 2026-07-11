import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";
import { authService } from "../services/auth.service";
import { COOKIE_OPTIONS } from "../utils/constants";
import { AuthRequest } from "../types";

export const authController = {
  register: catchAsync(async (req: AuthRequest, res: Response) => {
    const { user, token } = await authService.register(req.body);
    res.cookie("token", token, COOKIE_OPTIONS);
    ApiResponse.created(res, user, "Account created successfully");
  }),

  login: catchAsync(async (req: AuthRequest, res: Response) => {
    const { user, token } = await authService.login(req.body);
    res.cookie("token", token, COOKIE_OPTIONS);
    ApiResponse.success(res, user, "Login successful");
  }),

  logout: catchAsync(async (_req: AuthRequest, res: Response) => {
    res.cookie("token", "", { ...COOKIE_OPTIONS, maxAge: 0 });
    ApiResponse.success(res, null, "Logged out successfully");
  }),

  getMe: catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await authService.getMe(req.user!.userId);
    ApiResponse.success(res, user);
  }),
};
