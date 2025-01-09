import { Router } from "express";
import { RoleController } from "../controllers/role.controller";
import { authenticateToken } from "../middleware/auth.middleware";
const router = Router();

router.use(authenticateToken);

router.post("/", RoleController.create);
router.get("/", RoleController.getAll);
router.get("/:id", RoleController.getById);
router.delete("/:id", RoleController.delete);
router.put("/status/:id", RoleController.updateStatus);

export default router;
