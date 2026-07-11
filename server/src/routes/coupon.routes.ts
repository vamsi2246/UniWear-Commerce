import { Router } from "express";
import { couponController } from "../controllers/coupon.controller";
import { authenticate } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";
import { validate } from "../middleware/validate.middleware";
import { createCouponSchema, validateCouponSchema } from "../validators/coupon.validator";

const router = Router();

router.post("/validate", authenticate, validate(validateCouponSchema), couponController.validate);
router.get("/", authenticate, adminOnly, couponController.getAll);
router.post("/", authenticate, adminOnly, validate(createCouponSchema), couponController.create);
router.put("/:id", authenticate, adminOnly, couponController.update);
router.delete("/:id", authenticate, adminOnly, couponController.delete);

export default router;
