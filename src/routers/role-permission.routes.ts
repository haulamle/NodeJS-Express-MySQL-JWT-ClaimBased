import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { RolePermissionController } from "../controllers/role-permission.controller";

const router = Router();

router.use(authenticateToken);

router.post("/", RolePermissionController.create);
router.delete("/:id", RolePermissionController.delete);
router.get("/", RolePermissionController.getAll);

export default router;
