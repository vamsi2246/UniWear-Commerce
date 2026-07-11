import prisma from "../utils/prisma";
import { ApiError } from "../utils/ApiError";

export const wishlistService = {
  async getWishlist(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
            reviews: { select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async addToWishlist(userId: string, productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw ApiError.notFound("Product not found");

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      throw ApiError.conflict("Product is already in your wishlist");
    }

    return prisma.wishlist.create({
      data: { userId, productId },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
  },

  async removeFromWishlist(userId: string, productId: string) {
    const item = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (!item) throw ApiError.notFound("Item not found in wishlist");

    await prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } },
    });
  },

  async isInWishlist(userId: string, productId: string) {
    const item = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return !!item;
  },
};
