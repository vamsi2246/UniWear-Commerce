import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";
import { validate } from "../middleware/validate.middleware";
import { createProductSchema, updateProductSchema } from "../validators/product.validator";

const router = Router();

// Public routes
router.get("/", productController.getAll);
router.get("/featured", productController.getFeatured);
router.get("/:slug", productController.getBySlug);

// Admin routes
router.get("/admin/all", authenticate, adminOnly, productController.getAllAdmin);
router.post("/", authenticate, adminOnly, validate(createProductSchema), productController.create);
router.put("/:id", authenticate, adminOnly, validate(updateProductSchema), productController.update);
router.delete("/:id", authenticate, adminOnly, productController.delete);

export default router;
