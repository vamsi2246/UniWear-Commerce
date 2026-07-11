import request from "supertest";
import app from "../app";
import prisma from "../utils/prisma";
import * as jwtUtils from "../utils/jwt";

// Mock verifyToken to return a valid user payload
jest.mock("../utils/jwt", () => {
  const original = jest.requireActual("../utils/jwt");
  return {
    ...original,
    verifyToken: jest.fn(() => ({
      userId: "user-id-123",
      role: "USER",
    })),
  };
});

describe("Checkout & Order Transaction Integration Tests", () => {
  const mockCart = {
    id: "cart-id-123",
    userId: "user-id-123",
    items: [
      {
        id: "item-1",
        quantity: 2,
        productId: "product-1",
        product: {
          id: "product-1",
          name: "Classic Tee",
          price: 1000,
          stock: 10,
        },
      },
    ],
  };

  const mockCoupon = {
    id: "coupon-1",
    code: "SAVE10",
    discountPct: 10,
    minOrder: 1500,
    maxDiscount: 500,
    usageLimit: 100,
    usedCount: 0,
    expiresAt: new Date(Date.now() + 1000000),
    isActive: true,
  };

  const shippingDetails = {
    name: "Jane Doe",
    address: "456 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    zip: "400001",
    phone: "9876543210",
  };

  beforeEach(() => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-id-123",
      role: "USER",
    });
  });

  it("should successfully complete checkout and place an order", async () => {
    // 1. Mock cart retrieval
    (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);

    // 2. Mock order creation
    (prisma.order.create as jest.Mock).mockResolvedValue({
      id: "order-id-999",
      userId: "user-id-123",
      total: 2000,
      status: "PLACED",
    });

    // 3. Mock stock updates
    (prisma.product.update as jest.Mock).mockResolvedValue({});
    (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue({});

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", ["token=mock-valid-jwt-token"])
      .send({
        shipping: shippingDetails,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe("order-id-999");
    expect(prisma.order.create).toHaveBeenCalled();
  });

  it("should fail checkout if an item is out of stock", async () => {
    const outOfStockCart = {
      ...mockCart,
      items: [
        {
          ...mockCart.items[0],
          quantity: 20, // Requesting more than stock
        },
      ],
    };

    (prisma.cart.findUnique as jest.Mock).mockResolvedValue(outOfStockCart);

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", ["token=mock-valid-jwt-token"])
      .send({
        shipping: shippingDetails,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("in stock");
  });

  it("should successfully apply a valid coupon discount", async () => {
    (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);
    (prisma.coupon.findUnique as jest.Mock).mockResolvedValue(mockCoupon);
    (prisma.coupon.update as jest.Mock).mockResolvedValue({});

    (prisma.order.create as jest.Mock).mockResolvedValue({
      id: "order-id-with-coupon",
      userId: "user-id-123",
      total: 1800, // 2000 - 10% (200) = 1800
      status: "PLACED",
    });

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", ["token=mock-valid-jwt-token"])
      .send({
        shipping: shippingDetails,
        couponCode: "SAVE10",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBe(1800);
    expect(prisma.coupon.findUnique).toHaveBeenCalledWith({
      where: { code: "SAVE10" },
    });
  });

  it("should reject coupon if minOrder value is not satisfied", async () => {
    const lowValueCart = {
      ...mockCart,
      items: [
        {
          ...mockCart.items[0],
          quantity: 1, // Total value = 1000 (< minOrder 1500)
        },
      ],
    };

    (prisma.cart.findUnique as jest.Mock).mockResolvedValue(lowValueCart);
    (prisma.coupon.findUnique as jest.Mock).mockResolvedValue(mockCoupon);

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", ["token=mock-valid-jwt-token"])
      .send({
        shipping: shippingDetails,
        couponCode: "SAVE10",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Minimum order");
  });
});
