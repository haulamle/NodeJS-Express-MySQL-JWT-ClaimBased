import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { UserRole } from "../models/UserRole";

interface JWTPayload {
  id: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Access token required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JWTPayload;
    const user = await User.findOne({
      where: { id: decoded.id },
      include: [
        {
          model: UserRole,
          include: [Role],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found!!!!",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(403).json({
      error: "Invalid or exprired token",
    });
  }
};
