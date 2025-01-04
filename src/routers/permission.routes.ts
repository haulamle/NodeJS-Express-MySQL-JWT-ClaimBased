import { Router } from "express";
import { PermissionController } from "../controllers/permission.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticateToken, PermissionController.getAll);
router.get("/:id", authenticateToken, PermissionController.getById);
router.post("/", authenticateToken, PermissionController.create);
router.delete("/:id", authenticateToken, PermissionController.delete);

export default router;
