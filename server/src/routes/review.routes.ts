import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createReviewSchema, updateReviewSchema } from "../validators/review.validator";

const router = Router();

router.get("/product/:productId", reviewController.getProductReviews);
router.post("/product/:productId", authenticate, validate(createReviewSchema), reviewController.create);
router.put("/:id", authenticate, validate(updateReviewSchema), reviewController.update);
router.delete("/:id", authenticate, reviewController.delete);

export default router;
