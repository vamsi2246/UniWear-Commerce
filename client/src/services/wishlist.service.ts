import api from "@/lib/api";
import type { WishlistItem, ApiResponse } from "@/types";

export const wishlistService = {
  getWishlist: () =>
    api.get<ApiResponse<WishlistItem[]>>("/wishlist").then((r) => r.data),

  addToWishlist: (productId: string) =>
    api.post<ApiResponse<WishlistItem>>(`/wishlist/${productId}`).then((r) => r.data),

  removeFromWishlist: (productId: string) =>
    api.delete(`/wishlist/${productId}`).then((r) => r.data),
};
