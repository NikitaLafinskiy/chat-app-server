import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/ApiError";
import { TokenService } from "../services/token/TokenService";

export const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw ApiError.UnauthorizedError(
        "The auth header isn't present on the request"
      );
    }
    const token = authHeader.split(" ")[1];

    const { isValid } = TokenService.validateAccessToken(token);
    if (!isValid) {
      throw ApiError.UnauthorizedError("The token is invalid");
    }

    next();
  } catch (err) {
    next(ApiError.UnauthorizedError("Token is invalid"));
  }
};
