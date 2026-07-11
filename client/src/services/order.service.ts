import api from "@/lib/api";
import type { Order, ApiResponse, PaginatedResponse } from "@/types";

export const orderService = {
  create: (data: { shipping: any; couponCode?: string }) =>
    api.post<ApiResponse<Order>>("/orders", data).then((r) => r.data),

  getUserOrders: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Order>>(`/orders?page=${page}&limit=${limit}`).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`).then((r) => r.data),

  getAllOrders: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<Order>>(`/orders/admin/all?page=${page}&limit=${limit}`).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status }).then((r) => r.data),
};
