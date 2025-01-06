import { Router } from "express";
import { UserRoleController } from "../controllers/user-role.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticateToken, UserRoleController.create);
router.delete("/:id", authenticateToken, UserRoleController.delete);
router.get("/", authenticateToken, UserRoleController.getAll);

export default router;
