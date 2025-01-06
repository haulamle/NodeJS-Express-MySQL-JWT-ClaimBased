import { Request, Response, NextFunction } from "express";
import { RolePermission } from "../models/RolePermission";
import { Permission } from "../models/Permission";
import { UserRole } from "../models/UserRole";
import url from "url";
export const checkPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    console.log("Checking permissions for user:", req.user.id);
    console.log("Request full path:", url.parse(req.originalUrl).pathname);
    // console.log("Request path:", req.path);
    console.log("Request method:", req.method.toLowerCase());

    const userRoles = await UserRole.findAll({
      where: { userId: req.user.id },
    });

    console.log(
      "User roles:",
      userRoles.map((x) => x.roleId)
    );

    if (!userRoles.length) {
      return res.status(403).json({
        error: "Access denied",
        message: "No roles assigned to user",
      });
    }

    const roleIds = userRoles.map((x) => x.roleId);

    const hasPermission = await RolePermission.findOne({
      include: [
        {
          model: Permission,
          where: {
            apiEndpoint: url.parse(req.originalUrl).pathname,
            apiMethod: req.method.toLowerCase(),
          },
        },
      ],
      where: {
        roleId: roleIds,
        status: true,
      },
    });

    console.log("Found permission:", hasPermission);

    if (!hasPermission) {
      return res.status(403).json({
        error: "Access denied",
        message: `No permission found for ${req.method} ${req.path}`,
      });
    }

    next();
  } catch (error: any) {
    console.error("Permission check error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: `Error checking permissions: ${error.message}`,
    });
  }
};
