import { Request, Response } from "express";
import { Permission } from "../models/Permission";

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
      const permissions = await Permission.findAll();
      res.status(200).json({
        message: "Permissions retrieved successfully",
        permissions,
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
}
