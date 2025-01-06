import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { Permission } from "../models/Permission";
import { RolePermission } from "../models/RolePermission";
import { UserRole } from "../models/UserRole";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  models: [User, Role, Permission, RolePermission, UserRole],
  define: {
    timestamps: false, // Tắt timestamps để giảm columns
    freezeTableName: true,
    underscored: true,
  },
});
