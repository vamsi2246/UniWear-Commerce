import api from "@/lib/api";
import type { Cart, ApiResponse } from "@/types";

export const cartService = {
  getCart: () =>
    api.get<ApiResponse<Cart>>("/cart").then((r) => r.data),

  addItem: (data: { productId: string; quantity: number; size?: string | null; color?: string | null }) =>
    api.post<ApiResponse<Cart>>("/cart/items", data).then((r) => r.data),

  updateItem: (id: string, quantity: number) =>
    api.patch<ApiResponse<Cart>>(`/cart/items/${id}`, { quantity }).then((r) => r.data),

  removeItem: (id: string) =>
    api.delete<ApiResponse<Cart>>(`/cart/items/${id}`).then((r) => r.data),

  clearCart: () =>
    api.delete("/cart").then((r) => r.data),
};
