import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../utils/prisma";
import { ApiError } from "../utils/ApiError";
import { cartService } from "./cart.service";

export const orderService = {
  async create(
    userId: string,
    data: {
      shipping: {
        name: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        phone: string;
      };
      couponCode?: string;
    }
  ) {
    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw ApiError.badRequest("Cart is empty");
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.product.isArchived) {
        throw ApiError.badRequest(`${item.product.name} is no longer available`);
      }
      if (item.product.stock < item.quantity) {
        throw ApiError.badRequest(
          `${item.product.name} only has ${item.product.stock} items in stock`
        );
      }
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    // Apply coupon if provided
    let discount = 0;
    let couponId: string | null = null;

    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() },
      });

      if (!coupon) throw ApiError.notFound("Coupon not found");
      if (!coupon.isActive) throw ApiError.badRequest("This coupon is no longer active");
      if (new Date() > coupon.expiresAt) throw ApiError.badRequest("This coupon has expired");
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw ApiError.badRequest("This coupon has reached its usage limit");
      }
      if (subtotal < Number(coupon.minOrder)) {
        throw ApiError.badRequest(
          `Minimum order of ₹${coupon.minOrder} required for this coupon`
        );
      }

      discount = (subtotal * coupon.discountPct) / 100;
      if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
        discount = Number(coupon.maxDiscount);
      }

      couponId = coupon.id;
    }

    const total = subtotal - discount;

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          subtotal,
          discount,
          total,
          couponId,
          shipping: data.shipping,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              size: item.size,
              color: item.color,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, slug: true, images: true },
              },
            },
          },
        },
      });

      // Decrement stock for each product
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Increment coupon usage
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return order;
  },

  async getUserOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, slug: true, images: true },
              },
            },
          },
          coupon: { select: { code: true, discountPct: true } },
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return { orders, total, page, limit };
  },

  async getOrderById(orderId: string, userId: string, isAdmin = false) {
    const where: any = { id: orderId };
    if (!isAdmin) where.userId = userId;

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, images: true },
            },
          },
        },
        user: { select: { id: true, name: true, email: true } },
        coupon: { select: { code: true, discountPct: true } },
      },
    });

    if (!order) throw ApiError.notFound("Order not found");
    return order;
  },

  async getAllOrders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, images: true } },
            },
          },
        },
      }),
      prisma.order.count(),
    ]);

    return { orders, total, page, limit };
  },

  async updateStatus(orderId: string, status: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw ApiError.notFound("Order not found");

    return prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, images: true } },
          },
        },
      },
    });
  },
};
