import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";
import { productService } from "../services/product.service";
import { AuthRequest, ProductQuery } from "../types";

export const productController = {
  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await productService.getAll(req.query as unknown as ProductQuery);
    ApiResponse.paginated(res, result.products, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  }),

  getFeatured: catchAsync(async (_req: Request, res: Response) => {
    const products = await productService.getFeatured();
    ApiResponse.success(res, products);
  }),

  getBySlug: catchAsync(async (req: Request, res: Response) => {
    const product = await productService.getBySlug(req.params.slug as string);
    ApiResponse.success(res, product);
  }),

  create: catchAsync(async (req: AuthRequest, res: Response) => {
    const product = await productService.create(req.body);
    ApiResponse.created(res, product, "Product created successfully");
  }),

  update: catchAsync(async (req: AuthRequest, res: Response) => {
    const product = await productService.update(req.params.id as string, req.body);
    ApiResponse.success(res, product, "Product updated successfully");
  }),

  delete: catchAsync(async (req: AuthRequest, res: Response) => {
    await productService.delete(req.params.id as string);
    ApiResponse.success(res, null, "Product archived successfully");
  }),

  getAllAdmin: catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await productService.getAllAdmin(req.query as unknown as ProductQuery);
    ApiResponse.paginated(res, result.products, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  }),
};
