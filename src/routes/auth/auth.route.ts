import express from "express";
import { AuthController } from "../../controllers";
import { authHandler } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/api/auth/register", AuthController.register);
router.post("/api/auth/login", AuthController.login);
router.get("/api/auth/refresh", AuthController.refresh);
router.get("/api/auth/getUser", authHandler, AuthController.getUser);

export default router;
