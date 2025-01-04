import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { RolePermissionController } from "../controllers/role-permission.controller";

const router = Router();

router.post("/", authenticateToken, RolePermissionController.create);
router.delete("/:id", authenticateToken, RolePermissionController.delete);
router.get("/", authenticateToken, RolePermissionController.getAll);

export default router;
