import { Request, Response } from "express";
import { RolePermission } from "../models/RolePermission";
import { Role } from "../models/Role";
import { Permission } from "../models/Permission";

export class RolePermissionController {
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { roleId, permissionId } = req.body;

      const role = await Role.findByPk(roleId);
      if (!role) {
        res.status(404).json({ error: "Role not found" });
        return;
      }

      const permission = await Permission.findByPk(permissionId);
      if (!permission) {
        res.status(404).json({ error: "Permission not found" });
        return;
      }

      const existingRolePermission = await RolePermission.findOne({
        where: {
          roleId,
          permissionId,
        },
      });

      if (existingRolePermission) {
        res.status(400).json({
          error: "This permission is already assigned to this role",
        });
        return;
      }
      const rolePermission = await RolePermission.create({
        roleId,
        permissionId,
        status: true,
      });

      const detailedRolePermission = await RolePermission.findOne({
        where: { id: rolePermission.id },
        include: [
          {
            model: Role,
            attributes: ["id", "name"],
          },
          {
            model: Permission,
            attributes: ["id", "action", "apiEndpoint", "apiMethod"],
          },
        ],
      });

      res.status(201).json({
        message: "Role permission created successfully",
        data: detailedRolePermission,
      });
    } catch (error) {
      console.error("Create role permission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const rolePermission = await RolePermission.findByPk(id);
      if (!rolePermission) {
        res.status(404).json({ error: "Role permission not found" });
        return;
      }

      await rolePermission.destroy();
      res.status(204).json({ message: "Role permission deleted successfully" });
    } catch (error) {
      console.error("Delete role permission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const total = await RolePermission.count();

      const rolePermissions = await RolePermission.findAll({
        include: [
          {
            model: Role,
            attributes: ["id", "name"],
          },
          {
            model: Permission,
            attributes: ["id", "action", "apiEndpoint", "apiMethod"],
          },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Role permissions retrieved successfully",
        data: rolePermissions,
      });
    } catch (error) {
      console.error("Get role permissions error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
