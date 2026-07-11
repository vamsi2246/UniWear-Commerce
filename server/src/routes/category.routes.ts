import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import { authenticate } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";
import { validate } from "../middleware/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:slug", categoryController.getBySlug);
router.post("/", authenticate, adminOnly, validate(createCategorySchema), categoryController.create);
router.put("/:id", authenticate, adminOnly, validate(updateCategorySchema), categoryController.update);
router.delete("/:id", authenticate, adminOnly, categoryController.delete);

export default router;
