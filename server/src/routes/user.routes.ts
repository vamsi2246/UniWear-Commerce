import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

router.use(authenticate, adminOnly);

router.get("/dashboard", userController.getDashboardStats);
router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.patch("/:id/role", userController.updateRole);

export default router;
