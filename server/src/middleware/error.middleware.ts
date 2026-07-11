import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Prisma known errors
  if ((err as any).code === "P2002") {
    const target = (err as any).meta?.target;
    return res.status(409).json({
      success: false,
      message: `A record with this ${target?.[0] || "value"} already exists`,
    });
  }

  if ((err as any).code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  // Log unexpected errors
  console.error("Unhandled error:", err);

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
};
