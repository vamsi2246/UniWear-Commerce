import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";
import { categoryService } from "../services/category.service";
import { AuthRequest } from "../types";

export const categoryController = {
  getAll: catchAsync(async (_req: Request, res: Response) => {
    const categories = await categoryService.getAll();
    ApiResponse.success(res, categories);
  }),

  getBySlug: catchAsync(async (req: Request, res: Response) => {
    const category = await categoryService.getBySlug(req.params.slug as string);
    ApiResponse.success(res, category);
  }),

  create: catchAsync(async (req: AuthRequest, res: Response) => {
    const category = await categoryService.create(req.body);
    ApiResponse.created(res, category, "Category created successfully");
  }),

  update: catchAsync(async (req: AuthRequest, res: Response) => {
    const category = await categoryService.update(req.params.id as string, req.body);
    ApiResponse.success(res, category, "Category updated successfully");
  }),

  delete: catchAsync(async (req: AuthRequest, res: Response) => {
    await categoryService.delete(req.params.id as string);
    ApiResponse.success(res, null, "Category deleted successfully");
  }),
};
