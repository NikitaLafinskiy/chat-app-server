import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/ApiError";

export const errHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ msg: err.message, name: err.name });
    return;
  }
  res.status(500).json({ name: "Unknown error", msg: err.message });
};
