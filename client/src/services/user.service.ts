import api from "@/lib/api";
import type { User, DashboardStats, ApiResponse, PaginatedResponse } from "@/types";

export const userService = {
  getAll: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`).then((r) => r.data),

  updateRole: (id: string, role: string) =>
    api.patch<ApiResponse<User>>(`/users/${id}/role`, { role }).then((r) => r.data),

  getDashboardStats: () =>
    api.get<ApiResponse<DashboardStats>>("/users/dashboard").then((r) => r.data),
};
