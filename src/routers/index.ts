import { Router } from "express";
import authRoutes from "./auth.routes";
import roleRoutes from "./role.routes";
import permissionRoutes from "./permission.routes";
import rolePermissionRoutes from "./role-permission.routes";
import userRoleRoutes from "./user-role.routes";
import user from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/role-permissions", rolePermissionRoutes);
router.use("/user-roles", userRoleRoutes);
router.use("/users", user);

export default router;
