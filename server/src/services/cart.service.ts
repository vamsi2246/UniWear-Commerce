import prisma from "../utils/prisma";
import { ApiError } from "../utils/ApiError";

export const cartService = {
  async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                comparePrice: true,
                images: true,
                stock: true,
                sizes: true,
                colors: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  comparePrice: true,
                  images: true,
                  stock: true,
                  sizes: true,
                  colors: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  },

  async addItem(
    userId: string,
    data: { productId: string; quantity: number; size?: string | null; color?: string | null }
  ) {
    // Verify product exists and has stock
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) throw ApiError.notFound("Product not found");
    if (product.isArchived) throw ApiError.badRequest("This product is no longer available");
    if (product.stock < data.quantity) {
      throw ApiError.badRequest(`Only ${product.stock} items available in stock`);
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Check if item already in cart (same product + size + color)
    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: data.productId,
        size: data.size || null,
        color: data.color || null,
      },
    });

    if (existing) {
      const newQty = existing.quantity + data.quantity;
      if (newQty > product.stock) {
        throw ApiError.badRequest(`Only ${product.stock} items available in stock`);
      }

      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          quantity: data.quantity,
          size: data.size || null,
          color: data.color || null,
        },
      });
    }

    return this.getCart(userId);
  },

  async updateItem(userId: string, itemId: string, quantity: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw ApiError.notFound("Cart not found");

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: true },
    });

    if (!item) throw ApiError.notFound("Cart item not found");

    if (quantity > item.product.stock) {
      throw ApiError.badRequest(`Only ${item.product.stock} items available in stock`);
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(userId);
  },

  async removeItem(userId: string, itemId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw ApiError.notFound("Cart not found");

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) throw ApiError.notFound("Cart item not found");

    await prisma.cartItem.delete({ where: { id: itemId } });

    return this.getCart(userId);
  },

  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return;

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  },
};
