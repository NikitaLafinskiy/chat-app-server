import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../services/auth/AuthService";
import { AuthValidators } from "../../validators";
import { ApiError } from "../../exceptions/ApiError";
import { TokenService } from "../../services/token/TokenService";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const isValid = await AuthValidators.registerValidator.validate({
        username,
        password,
      });

      if (!isValid) {
        throw ApiError.BadRequestError("Invalid username or password", isValid);
      }

      const { refreshUUID, accessUUID } = await AuthService.register(
        username,
        password
      );

      res.json({ refreshUUID, accessUUID });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const isValid = await AuthValidators.registerValidator.validate({
        username,
        password,
      });

      if (!isValid) {
        throw ApiError.BadRequestError("Invalid username or password", isValid);
      }

      const { refreshUUID, accessUUID, user } = await AuthService.login(
        username,
        password
      );

      res.json({ refreshUUID, accessUUID, user });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { token: refreshUUID } = TokenService.extractTokenFromHeaders(
        req,
        "Refresh"
      );
      const { msg } = await AuthService.logout(refreshUUID);

      res.clearCookie("refreshToken");

      res.json({ msg });
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { token: refreshID } = TokenService.extractTokenFromHeaders(
        req,
        "Refresh"
      );
      if (!refreshID) {
        throw ApiError.UnauthorizedError("No token cookie is present");
      }
      const { accessUUID, refreshUUID, user } = await AuthService.refresh(
        refreshID
      );
      res.json({ accessUUID, refreshUUID, user });
    } catch (err) {
      next(err);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { token: accessUUID } = TokenService.extractTokenFromHeaders(
        req,
        "Bearer"
      );
      const { user } = await AuthService.getUser(accessUUID);

      res.json({ user });
    } catch (err) {
      next(err);
    }
  }
}
