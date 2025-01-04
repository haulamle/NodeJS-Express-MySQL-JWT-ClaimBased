import { Request, Response } from "express";
import { UserRole } from "../models/UserRole";
import { User } from "../models/User";
import { Role } from "../models/Role";

export class UserRoleController {
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { userId, roleId } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const role = await Role.findByPk(roleId);
      if (!role) {
        res.status(404).json({ error: "Role not found" });
        return;
      }

      const existingUserRole = await UserRole.findOne({
        where: {
          userId,
          roleId,
        },
      });

      if (existingUserRole) {
        res.status(400).json({ error: "User role already exists" });
        return;
      }

      const userRole = await UserRole.create({
        userId,
        roleId,
      });

      const userRoleWithDetails = await UserRole.findByPk(userRole.id, {
        include: [
          {
            model: User,
            attributes: ["id", "username"],
          },
          {
            model: Role,
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(201).json({
        message: "User role created successfully",
        userRole: userRoleWithDetails,
      });
    } catch (error) {
      console.error("Create user role error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const userRole = await UserRole.findByPk(id);
      if (!userRole) {
        res.status(404).json({ error: "User role not found" });
        return;
      }

      await userRole.destroy();
      res.status(204).json({ message: "User role deleted successfully" });
    } catch (error) {
      console.error("Delete user role error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userRoles = await UserRole.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "username"],
          },
          {
            model: Role,
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(200).json({
        message: "User roles retrieved successfully",
        userRoles,
      });
    } catch (error) {
      console.error("Get user roles error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
