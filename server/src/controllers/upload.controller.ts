import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import cloudinary from "../utils/cloudinary";
import { AuthRequest } from "../types";

export const uploadController = {
  uploadImage: catchAsync(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw ApiError.badRequest("No image file provided");
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "uniwear",
      transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
    });

    ApiResponse.success(res, {
      url: result.secure_url,
      publicId: result.public_id,
    }, "Image uploaded successfully");
  }),

  deleteImage: catchAsync(async (req: AuthRequest, res: Response) => {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId as string);
    ApiResponse.success(res, null, "Image deleted successfully");
  }),
};
