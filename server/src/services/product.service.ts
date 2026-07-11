import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";
import { ApiError } from "../utils/ApiError";
import { ProductQuery } from "../types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const productService = {
  async getAll(query: ProductQuery) {
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "12");
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isArchived: false,
    };

    // Search
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    // Category filter
    if (query.category) {
      where.category = { slug: query.category };
    }

    // Price range
    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
      if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
    }

    // Size filter
    if (query.sizes) {
      where.sizes = { hasSome: query.sizes.split(",") };
    }

    // Color filter
    if (query.colors) {
      where.colors = { hasSome: query.colors.split(",") };
    }

    // Featured filter
    if (query.featured === "true") {
      where.isFeatured = true;
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    switch (query.sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "name_asc":
        orderBy = { name: "asc" };
        break;
      case "name_desc":
        orderBy = { name: "desc" };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Attach average rating
    const productsWithRating = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;
      const { reviews, ...rest } = p;
      return { ...rest, avgRating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length };
    });

    return { products: productsWithRating, total, page, limit };
  },

  async getFeatured() {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isArchived: false },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        reviews: { select: { rating: true } },
      },
    });

    return products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;
      const { reviews, ...rest } = p;
      return { ...rest, avgRating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length };
    });
  },

  async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    return {
      ...product,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
    };
  },

  async create(data: {
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    sizes: string[];
    colors: string[];
    stock: number;
    categoryId: string;
    isFeatured?: boolean;
    isArchived?: boolean;
  }) {
    const slug = slugify(data.name) + "-" + Date.now().toString(36);

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw ApiError.notFound("Category not found");

    return prisma.product.create({
      data: { ...data, slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  },

  async update(id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    sizes: string[];
    colors: string[];
    stock: number;
    categoryId: string;
    isFeatured: boolean;
    isArchived: boolean;
  }>) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw ApiError.notFound("Product not found");

    const updateData: any = { ...data };
    if (data.name && data.name !== product.name) {
      updateData.slug = slugify(data.name) + "-" + Date.now().toString(36);
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  },

  async delete(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw ApiError.notFound("Product not found");

    // Soft delete by archiving
    return prisma.product.update({
      where: { id },
      data: { isArchived: true },
    });
  },

  // Admin: get all including archived
  async getAllAdmin(query: ProductQuery) {
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "20");
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
  },
};
