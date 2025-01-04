"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const RolePermission_1 = require("../models/RolePermission");
const Permission_1 = require("../models/Permission");
const UserRole_1 = require("../models/UserRole");
const checkPermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(403).json({
                error: "User not authenticated",
            });
        }
        const userRoles = yield UserRole_1.UserRole.findAll({
            where: {
                userId: req.user.id,
            },
        });
        const roleIds = userRoles.map((x) => x.roleId);
        const hasPermission = yield RolePermission_1.RolePermission.findOne({
            include: [
                {
                    model: Permission_1.Permission,
                    where: {
                        apiEndpoint: req.path,
                        apiMethod: req.method.toLowerCase(),
                    },
                },
            ],
            where: {
                roleId: roleIds,
            },
        });
        if (!hasPermission) {
            return res.status(403).json({
                error: "Access denied",
                message: "You do not have permission to access this resource",
            });
        }
        next();
    }
    catch (error) {
        console.error("Permission check error: ", error);
        res.status(500).json({
            error: "Internal server error",
        });
    }
});
exports.checkPermission = checkPermission;
