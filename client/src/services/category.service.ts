import api from "@/lib/api";
import type { Category, ApiResponse } from "@/types";

export const categoryService = {
  getAll: () =>
    api.get<ApiResponse<Category[]>>("/categories").then((r) => r.data),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Category>>(`/categories/${slug}`).then((r) => r.data),

  create: (data: { name: string; description?: string; image?: string | null }) =>
    api.post<ApiResponse<Category>>("/categories", data).then((r) => r.data),

  update: (id: string, data: any) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/categories/${id}`).then((r) => r.data),
};
