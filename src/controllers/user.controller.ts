import { Request, Response } from "express";
import { User } from "../models/User";
import { UserRole } from "../models/UserRole";
import bcrypt from "bcrypt";
import { Role } from "../models/Role";

export class UserController {
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, roleIds } = req.body;

      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        res.status(400).json({ error: "Username already exists" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        password: hashedPassword,
      });

      if (roleIds && Array.isArray(roleIds)) {
        await Promise.all(
          roleIds.map((roleId) =>
            UserRole.create({
              userId: user.id,
              roleId,
            })
          )
        );
      }

      const userWithRoles = await User.findByPk(user.id, {
        include: [UserRole],
        attributes: { exclude: ["password"] }, // Không trả về password
      });

      res.status(201).json({
        message: "User created successfully",
        user: userWithRoles,
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.findAll({
        include: [
          {
            model: UserRole,
            include: [
              {
                model: Role,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
        attributes: { exclude: ["password"] }, // Không trả về password
      });
      res.status(200).json({
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { username, roleIds } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (username) {
        user.username = username;
        await user.save();
      }

      if (roleIds) {
        await UserRole.destroy({
          where: { userId: id },
        });

        if (roleIds.length > 0) {
          await UserRole.bulkCreate(
            roleIds.map((roleId: string) => ({
              userId: id,
              roleId,
            }))
          );
        }
      }

      const updatedUser = await User.findByPk(id, {
        include: [
          {
            model: UserRole,
            include: [
              {
                model: Role,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
        attributes: { exclude: ["password"] },
      });

      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      await user.destroy();

      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        include: [UserRole],
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json({
        message: "User retrieved successfully",
        user,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      user.status = status;
      await user.save();

      res.status(200).json({
        message: "User status updated successfully",
        data: user,
      });
    } catch (error) {
      console.error("Update user status error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
