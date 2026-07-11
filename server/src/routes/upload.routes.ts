import { Router } from "express";
import { uploadController } from "../controllers/upload.controller";
import { authenticate } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.use(authenticate, adminOnly);

router.post("/image", upload.single("image"), uploadController.uploadImage);
router.delete("/image/:publicId", uploadController.deleteImage);

export default router;
