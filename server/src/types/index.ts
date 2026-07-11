import { Request } from "express";

export interface AuthUser {
  userId: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ProductQuery extends PaginationQuery {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sizes?: string;
  colors?: string;
  sort?: string;
  featured?: string;
}
