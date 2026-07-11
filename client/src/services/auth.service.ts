import api from "@/lib/api";
import type { User, ApiResponse } from "@/types";

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<User>>("/auth/register", data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<User>>("/auth/login", data).then((r) => r.data),

  logout: () => api.post("/auth/logout").then((r) => r.data),

  getMe: () =>
    api.get<ApiResponse<User>>("/auth/me").then((r) => r.data),
};
