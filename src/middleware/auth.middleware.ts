import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { client } from "../config/redis.config";
import { ApiError } from "../exceptions/ApiError";
import { TokenService } from "../services/token/TokenService";

export const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token: accessUUID } = TokenService.extractTokenFromHeaders(
      req,
      "Bearer"
    );
    const accessToken = await client.get(accessUUID);

    if (!accessToken) {
      res.redirect("/api/auth/refresh");
      return;
    }

    verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN as string,
      (err, decoded) => {
        if (err) {
          res.redirect("/api/auth/refresh");
          return;
        }
        if (decoded) {
          next();
        }
      }
    );
  } catch (err) {
    next(ApiError.UnauthorizedError("Token is invalid"));
  }
};
