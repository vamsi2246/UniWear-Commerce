import { Router } from "express";
import { cartController } from "../controllers/cart.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { addToCartSchema, updateCartItemSchema } from "../validators/cart.validator";

const router = Router();

router.use(authenticate); // All cart routes require authentication

router.get("/", cartController.getCart);
router.post("/items", validate(addToCartSchema), cartController.addItem);
router.patch("/items/:id", validate(updateCartItemSchema), cartController.updateItem);
router.delete("/items/:id", cartController.removeItem);
router.delete("/", cartController.clearCart);

export default router;
