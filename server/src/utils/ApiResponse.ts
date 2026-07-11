import { Response } from "express";

interface ApiResponseData<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message = "Success", statusCode = 200) {
    const response: ApiResponseData<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message = "Created successfully") {
    return ApiResponse.success(res, data, message, 201);
  }

  static paginated<T>(
    res: Response,
    data: T,
    meta: { page: number; limit: number; total: number },
    message = "Success"
  ) {
    const response: ApiResponseData<T> = {
      success: true,
      message,
      data,
      meta: {
        ...meta,
        totalPages: Math.ceil(meta.total / meta.limit),
      },
    };
    return res.status(200).json(response);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }

  static error(res: Response, statusCode: number, message: string) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
