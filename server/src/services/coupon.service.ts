import prisma from "../utils/prisma";
import { ApiError } from "../utils/ApiError";

export const couponService = {
  async validate(code: string, orderTotal: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) throw ApiError.notFound("Coupon not found");
    if (!coupon.isActive) throw ApiError.badRequest("This coupon is no longer active");
    if (new Date() > coupon.expiresAt) throw ApiError.badRequest("This coupon has expired");
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw ApiError.badRequest("This coupon has reached its usage limit");
    }
    if (orderTotal < Number(coupon.minOrder)) {
      throw ApiError.badRequest(
        `Minimum order of ₹${Number(coupon.minOrder).toFixed(2)} required`
      );
    }

    let discount = (orderTotal * coupon.discountPct) / 100;
    if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
      discount = Number(coupon.maxDiscount);
    }

    return {
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountPct: coupon.discountPct,
      },
      discount: Math.round(discount * 100) / 100,
      total: Math.round((orderTotal - discount) * 100) / 100,
    };
  },

  async getAll() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    });
  },

  async create(data: {
    code: string;
    discountPct: number;
    minOrder?: number;
    maxDiscount?: number | null;
    usageLimit?: number | null;
    expiresAt: string;
  }) {
    return prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discountPct: data.discountPct,
        minOrder: data.minOrder || 0,
        maxDiscount: data.maxDiscount,
        usageLimit: data.usageLimit,
        expiresAt: new Date(data.expiresAt),
      },
    });
  },

  async update(
    id: string,
    data: Partial<{
      code: string;
      discountPct: number;
      minOrder: number;
      maxDiscount: number | null;
      usageLimit: number | null;
      expiresAt: string;
      isActive: boolean;
    }>
  ) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw ApiError.notFound("Coupon not found");

    const updateData: any = { ...data };
    if (data.code) updateData.code = data.code.toUpperCase();
    if (data.expiresAt) updateData.expiresAt = new Date(data.expiresAt);

    return prisma.coupon.update({ where: { id }, data: updateData });
  },

  async delete(id: string) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw ApiError.notFound("Coupon not found");

    return prisma.coupon.delete({ where: { id } });
  },
};
