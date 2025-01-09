import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkPermission } from "../middleware/permisson.middleware";
import { UserController } from "../controllers/user.controller";

const router = Router();

// Protected routes với permission check
router.post("/", authenticateToken, checkPermission, UserController.create);

router.get("/", authenticateToken, checkPermission, UserController.getAll);

router.put("/:id", authenticateToken, checkPermission, UserController.update);

router.delete(
  "/:id",
  authenticateToken,
  checkPermission,
  UserController.delete
);

router.put(
  "/status/:id",
  authenticateToken,
  checkPermission,
  UserController.updateStatus
);

export default router;
