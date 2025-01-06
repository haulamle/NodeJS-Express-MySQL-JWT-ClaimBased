import { Request, Response } from "express";
import { Role } from "../models/Role";

export class RoleController {
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;

      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        res.status(400).json({ error: "Role with this name already exists" });
        return;
      }

      const role = await Role.create({ name, description });
      res.status(201).json({
        message: "Role created successfully",
        role,
      });
    } catch (error) {
      console.error("Create role error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const roles = await Role.findAll();
      res.status(200).json({
        message: "Roles retrieved successfully",
        data: roles,
      });
    } catch (error) {
      console.error("Get all roles error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  public static async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        res.status(404).json({ error: "Role not found" });
        return;
      }
      res.status(200).json({
        message: "Role retrieved successfully",
        role,
      });
    } catch (error) {
      console.error("Get role by id error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  public static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        res.status(404).json({ error: "Role not found" });
        return;
      }
      await role.destroy();
      res.status(204).json({ message: "Role deleted successfully" });
    } catch (error) {
      console.error("Delete role error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
