import prisma from "../utils/prisma";
import { ApiError } from "../utils/ApiError";

export const userService = {
  async getAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          phone: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      prisma.user.count(),
    ]);

    return { users, total, page, limit };
  },

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true, reviews: true } },
      },
    });

    if (!user) throw ApiError.notFound("User not found");
    return user;
  },

  async updateRole(id: string, role: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw ApiError.notFound("User not found");

    return prisma.user.update({
      where: { id },
      data: { role: role as any },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  },

  async getDashboardStats() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueResult,
      recentOrders,
      ordersByStatus,
      lowStockProducts,
      recentOrdersForRevenue,
      orderItemsForPerformance,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { isArchived: false } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { items: true } },
        },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.product.count({
        where: { stock: { lt: 10 }, isArchived: false },
      }),
      prisma.order.findMany({
        where: {
          createdAt: { gte: sixMonthsAgo },
          status: { not: "CANCELLED" },
        },
        select: { createdAt: true, total: true },
      }),
      prisma.orderItem.findMany({
        include: {
          product: {
            select: {
              category: { select: { name: true } },
            },
          },
        },
      }),
    ]);

    // 1. Calculate Monthly Revenue trends (chronological order)
    const monthlyRevenueMap: Map<string, { key: number; revenue: number }> = new Map();
    // Pre-populate last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
      monthlyRevenueMap.set(monthName, { key: d.getTime(), revenue: 0 });
    }

    recentOrdersForRevenue.forEach((order) => {
      const monthName = order.createdAt.toLocaleString("en-US", { month: "short", year: "2-digit" });
      const current = monthlyRevenueMap.get(monthName);
      if (current) {
        current.revenue += Number(order.total);
      }
    });

    const monthlyRevenue = Array.from(monthlyRevenueMap.entries())
      .map(([month, data]) => ({
        month,
        revenue: Math.round(data.revenue * 100) / 100,
        key: data.key,
      }))
      .sort((a, b) => a.key - b.key)
      .map(({ month, revenue }) => ({ month, revenue }));

    // 2. Calculate Category Sales Performance
    const categorySalesMap: Record<string, number> = {};
    orderItemsForPerformance.forEach((item) => {
      const catName = item.product?.category?.name || "Uncategorized";
      const totalAmount = Number(item.price) * item.quantity;
      categorySalesMap[catName] = (categorySalesMap[catName] || 0) + totalAmount;
    });

    const categoryPerformance = Object.entries(categorySalesMap).map(([category, value]) => ({
      category,
      value: Math.round(value * 100) / 100,
    }));

    // 3. Top Selling Products
    const productSalesMap: Record<string, { name: string; price: number; quantity: number }> = {};
    orderItemsForPerformance.forEach((item) => {
      const pId = item.productId;
      if (!productSalesMap[pId]) {
        productSalesMap[pId] = {
          name: "Product #" + pId.slice(-4),
          price: Number(item.price),
          quantity: 0,
        };
      }
      productSalesMap[pId].quantity += item.quantity;
    });

    // Hydrate top names
    const topSellingRaw = Object.entries(productSalesMap)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const topSelling = await Promise.all(
      topSellingRaw.map(async (item) => {
        const prod = await prisma.product.findUnique({
          where: { id: item.id },
          select: { name: true },
        });
        if (prod) {
          item.name = prod.name;
        }
        return item;
      })
    );

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult._sum.total || 0,
      recentOrders,
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
      lowStockProducts,
      monthlyRevenue,
      categoryPerformance,
      topSelling,
    };
  },
};
