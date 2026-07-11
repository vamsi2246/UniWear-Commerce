import api from "@/lib/api";
import type { Product, ApiResponse, PaginatedResponse } from "@/types";

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string;
  colors?: string;
  sort?: string;
  featured?: boolean;
}

export const productService = {
  getAll: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
    return api
      .get<PaginatedResponse<Product>>(`/products?${params.toString()}`)
      .then((r) => r.data);
  },

  getFeatured: () =>
    api.get<ApiResponse<Product[]>>("/products/featured").then((r) => r.data),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Product>>(`/products/${slug}`).then((r) => r.data),

  create: (data: any) =>
    api.post<ApiResponse<Product>>("/products", data).then((r) => r.data),

  update: (id: string, data: any) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/products/${id}`).then((r) => r.data),

  getAllAdmin: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
    return api
      .get<PaginatedResponse<Product>>(`/products/admin/all?${params.toString()}`)
      .then((r) => r.data);
  },
};
