import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";
import { authService } from "../services/auth.service";
import { oauthService } from "../services/oauth.service";
import { generateToken } from "../utils/jwt";
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

  googleLogin: catchAsync(async (_req: AuthRequest, res: Response) => {
    const url = oauthService.getGoogleAuthUrl();
    res.redirect(url);
  }),

  googleCallback: catchAsync(async (req: AuthRequest, res: Response) => {
    const code = req.query.code as string;
    if (!code) {
      res.redirect((process.env.CLIENT_URL || "http://localhost:5173") + "/login?error=no_code");
      return;
    }

    const profile = await oauthService.getGoogleProfile(code);
    const user = await oauthService.handleGoogleUser(profile);
    const token = generateToken({ userId: user.id, role: user.role });

    res.cookie("token", token, COOKIE_OPTIONS);
    res.redirect(process.env.CLIENT_URL || "http://localhost:5173");
  }),
};
