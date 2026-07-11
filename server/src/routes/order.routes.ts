import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";
import { validate } from "../middleware/validate.middleware";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/order.validator";

const router = Router();

router.use(authenticate);

router.post("/", validate(createOrderSchema), orderController.create);
router.get("/", orderController.getUserOrders);
router.get("/admin/all", adminOnly, orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", adminOnly, validate(updateOrderStatusSchema), orderController.updateStatus);

export default router;
