import prisma from "../utils/prisma";
import { ApiError } from "../utils/ApiError";

export const reviewService = {
  async getProductReviews(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw ApiError.notFound("Product not found");

    return prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async create(userId: string, productId: string, data: { rating: number; comment?: string }) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw ApiError.notFound("Product not found");

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      throw ApiError.conflict("You have already reviewed this product");
    }

    return prisma.review.create({
      data: {
        userId,
        productId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  },

  async update(reviewId: string, userId: string, data: { rating?: number; comment?: string }) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw ApiError.notFound("Review not found");
    if (review.userId !== userId) throw ApiError.forbidden("You can only edit your own reviews");

    return prisma.review.update({
      where: { id: reviewId },
      data,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  },

  async delete(reviewId: string, userId: string, isAdmin: boolean) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw ApiError.notFound("Review not found");
    if (!isAdmin && review.userId !== userId) {
      throw ApiError.forbidden("You can only delete your own reviews");
    }

    await prisma.review.delete({ where: { id: reviewId } });
  },
};
