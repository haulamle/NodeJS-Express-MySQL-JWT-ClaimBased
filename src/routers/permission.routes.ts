import { Router } from "express";
import { PermissionController } from "../controllers/permission.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkPermission } from "../middleware/permisson.middleware";

const router = Router();

router.use(authenticateToken);

router.get("/", PermissionController.getAll);
router.get("/:id", PermissionController.getById);
router.post("/", PermissionController.create);
router.delete("/:id", PermissionController.delete);
router.put("/status/:id/", checkPermission, PermissionController.updateStatus);

export default router;
