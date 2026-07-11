import api from "@/lib/api";
import type { Coupon, ApiResponse } from "@/types";

export const couponService = {
  validate: (code: string, orderTotal: number) =>
    api.post<ApiResponse<{ coupon: { id: string; code: string; discountPct: number }; discount: number; total: number }>>(
      "/coupons/validate",
      { code, orderTotal }
    ).then((r) => r.data),

  getAll: () =>
    api.get<ApiResponse<Coupon[]>>("/coupons").then((r) => r.data),

  create: (data: any) =>
    api.post<ApiResponse<Coupon>>("/coupons", data).then((r) => r.data),

  update: (id: string, data: any) =>
    api.put<ApiResponse<Coupon>>(`/coupons/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/coupons/${id}`).then((r) => r.data),
};
