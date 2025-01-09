import { Router } from "express";
import { UserRoleController } from "../controllers/user-role.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken);
router.post("/", UserRoleController.create);
router.delete("/:id", UserRoleController.delete);
router.get("/", UserRoleController.getAll);

export default router;
