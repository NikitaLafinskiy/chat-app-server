import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../services/auth/AuthService";
import { AuthValidators } from "../../validators";
import { ApiError } from "../../exceptions/ApiError";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      console.log(req.body);
      const isValid = AuthValidators.registerValidator.validate({
        username,
        password,
      });
      if (!isValid) {
        throw ApiError.BadRequestError("Invalid username or password", isValid);
      }
      const { refreshToken, accessToken } = await AuthService.register(
        username,
        password
      );

      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      res.json({ refreshToken, accessToken });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const isValid = AuthValidators.registerValidator.validate({
        username,
        password,
      });
      if (!isValid) {
        throw ApiError.BadRequestError("Invalid username or password", isValid);
      }
      const { refreshToken, accessToken } = await AuthService.login(
        username,
        password
      );

      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      res.json({ refreshToken, accessToken });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const { msg } = await AuthService.logout(refreshToken);

      res.clearCookie("refreshToken");

      res.json({ msg });
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw ApiError.UnauthorizedError("No token cookie is present");
      }
      const { accessToken } = await AuthService.refresh(refreshToken);
      res.json({ accessToken });
    } catch (err) {
      next(err);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const headers = req.headers.authorization as string;
      const token = headers.split(" ")[1];

      const { user } = await AuthService.getUser(token);

      res.json({ user });
    } catch (err) {
      next(err);
    }
  }
}
