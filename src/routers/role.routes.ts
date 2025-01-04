import { Router } from "express";
import { RoleController } from "../controllers/role.controller";
import { authenticateToken } from "../middleware/auth.middleware";
const router = Router();

// router.use(authenticateToken);

router.post("/", authenticateToken, RoleController.create);
router.get("/", authenticateToken, RoleController.getAll);
router.get("/:id", authenticateToken, RoleController.getById);
router.delete("/:id", authenticateToken, RoleController.delete);

export default router;
