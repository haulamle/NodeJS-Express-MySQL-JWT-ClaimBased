import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { UserRole } from "../models/UserRole";

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, roleId } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        password: hashedPassword,
      });

      if (roleId) {
        await UserRole.create({
          userId: user.id,
          roleId,
        });
      }

      res.status(201).json({
        message: "User registered successfully",
        userId: user.id,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({
        where: { username },
        include: [
          {
            model: UserRole,
            include: [Role],
          },
        ],
      });

      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      if (!user.status) {
        res.status(403).json({
          error: "Account is locked",
          message:
            "Your account has been disabled. Please contact administrator.",
        });
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            roles: user.userRoles.map((x) => x.role),
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
