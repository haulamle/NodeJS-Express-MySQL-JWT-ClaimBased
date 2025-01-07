import { Request, Response } from "express";
import { Permission } from "../models/Permission";
import { RolePermission } from "../models/RolePermission";
import { Role } from "../models/Role";
import { UserRole } from "../models/UserRole";

export class PermissionController {
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { action, apiEndpoint, apiMethod } = req.body;

      const existingPermission = await Permission.findOne({
        where: { apiEndpoint, apiMethod },
      });

      if (existingPermission) {
        res.status(400).json({ error: "Permission already exists" });
        return;
      }

      const permission = await Permission.create({
        action,
        apiEndpoint,
        apiMethod,
      });

      res.status(201).json({
        message: "Permission created successfully",
        permission,
      });
    } catch (error) {
      console.error("Create permission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const total = await Permission.count();

      const permissions = await Permission.findAll({
        include: [
          {
            model: RolePermission,
            attributes: ["status"],
            required: false,
          },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      // Transform data
      const transformedPermissions = permissions.map((permission) => {
        const plainPermission = permission.get({ plain: true });
        const { rolePermissions, ...rest } = plainPermission;

        return {
          ...rest,
          status: rolePermissions?.[0]?.status ?? false,
        };
      });

      res.status(200).json({
        message: "Permissions retrieved successfully",
        data: transformedPermissions,
        pagination: {
          currentPage: page,
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get all permissions error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const permission = await Permission.findByPk(id);
      if (!permission) {
        res.status(404).json({ error: "Permission not found" });
        return;
      }
      res.status(200).json({
        message: "Permission retrieved successfully",
        permission,
      });
    } catch (error) {
      console.error("Get permission by id error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const permission = await Permission.findByPk(id);
      if (!permission) {
        res.status(404).json({ error: "Permission not found" });
        return;
      }
      await permission.destroy();
      res.status(204).json({ message: "Permission deleted successfully" });
    } catch (error) {
      console.error("Delete permission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const rolePermission = await RolePermission.findByPk(id);

      if (!rolePermission) {
        res.status(404).json({ error: "Role permission not found" });
        return;
      }

      await rolePermission.update({ status });

      const updatedRolePermission = await RolePermission.findOne({
        where: { id },
        include: [
          {
            model: Permission,
            attributes: ["id", "action", "apiEndpoint", "apiMethod"],
          },
          {
            model: Role,
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(200).json({
        message: "Status updated successfully",
        data: updatedRolePermission,
      });
    } catch (error) {
      console.error("Update status error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
