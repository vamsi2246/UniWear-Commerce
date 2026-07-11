import request from "supertest";
import app from "../app";
import prisma from "../utils/prisma";
import bcrypt from "bcryptjs";

describe("Authentication Integration Tests", () => {
  const mockUser = {
    id: "user-id-123",
    name: "John Doe",
    email: "john.doe@example.com",
    password: "hashedPassword123",
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should successfully register a new user", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
    });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(mockUser.email);
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it("should fail registration if email already exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("already exists");
  });

  it("should successfully login with valid credentials", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, "compare").mockImplementation(() => Promise.resolve(true));

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "john.doe@example.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(mockUser.email);
    expect(res.headers["set-cookie"]).toBeDefined(); // Cookie containing token should be set
  });

  it("should fail login with incorrect password", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, "compare").mockImplementation(() => Promise.resolve(false));

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "john.doe@example.com",
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Invalid email or password");
  });
});
