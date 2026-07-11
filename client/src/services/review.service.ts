import api from "@/lib/api";
import type { Review, ApiResponse } from "@/types";

export const reviewService = {
  getProductReviews: (productId: string) =>
    api.get<ApiResponse<Review[]>>(`/reviews/product/${productId}`).then((r) => r.data),

  create: (productId: string, data: { rating: number; comment?: string }) =>
    api.post<ApiResponse<Review>>(`/reviews/product/${productId}`, data).then((r) => r.data),

  update: (id: string, data: { rating?: number; comment?: string }) =>
    api.put<ApiResponse<Review>>(`/reviews/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/reviews/${id}`).then((r) => r.data),
};
