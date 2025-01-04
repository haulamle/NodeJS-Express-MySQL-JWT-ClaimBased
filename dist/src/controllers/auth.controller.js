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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Role_1 = require("../models/Role");
const UserRole_1 = require("../models/UserRole");
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, roleId } = req.body;
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const user = yield User_1.User.create({
                    username,
                    password: hashedPassword,
                });
                if (roleId) {
                    yield UserRole_1.UserRole.create({
                        userId: user.id,
                        roleId,
                    });
                }
                res.status(201).json({
                    message: "User registered successfully",
                    userId: user.id,
                });
            }
            catch (error) {
                console.error("Registration error:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const user = yield User_1.User.findOne({
                    where: { username },
                    include: [
                        {
                            model: UserRole_1.UserRole,
                            include: [Role_1.Role],
                        },
                    ],
                });
                if (!user) {
                    res.status(401).json({ error: "Invalid credentials" });
                    return;
                }
                const validPassword = yield bcrypt_1.default.compare(password, user.password);
                if (!validPassword) {
                    res.status(401).json({ error: "Invalid credentials" });
                    return;
                }
                const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "24h" });
                res.json({
                    message: "Login successful",
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        roles: user.userRoles.map((x) => x.role),
                    },
                });
            }
            catch (error) {
                console.error("Login error:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
}
exports.AuthController = AuthController;
