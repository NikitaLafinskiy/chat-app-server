"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../controllers");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/api/auth/register", controllers_1.AuthController.register);
router.post("/api/auth/login", controllers_1.AuthController.login);
router.get("/api/auth/refresh", controllers_1.AuthController.refresh);
router.get("/api/auth/getUser", auth_middleware_1.authHandler, controllers_1.AuthController.getUser);
exports.default = router;
