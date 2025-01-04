import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkPermission } from "../middleware/permisson.middleware";
import { UserController } from "../controllers/user.controller";

const router = Router();

// Protected routes với permission check
router.post(
  "/",
  authenticateToken,
  checkPermission, // Kiểm tra permission create user
  UserController.create
);

router.get(
  "/",
  authenticateToken,
  checkPermission, // Kiểm tra permission read users
  UserController.getAll
);

router.put(
  "/update",
  authenticateToken,
  checkPermission, // Kiểm tra permission update user
  UserController.update
);

router.delete(
  "/delete",
  authenticateToken,
  checkPermission, // Kiểm tra permission delete user
  UserController.delete
);

export default router;
