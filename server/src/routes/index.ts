import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import categoryRoutes from "./category.routes";
import cartRoutes from "./cart.routes";
import orderRoutes from "./order.routes";
import wishlistRoutes from "./wishlist.routes";
import reviewRoutes from "./review.routes";
import couponRoutes from "./coupon.routes";
import userRoutes from "./user.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/reviews", reviewRoutes);
router.use("/coupons", couponRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);

export default router;
