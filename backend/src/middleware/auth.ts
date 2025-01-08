import { Request, Response, NextFunction } from "express";
import { authService } from "src/services/user";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("No token provided");

    const decoded = await authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ error: err.message });
    } else {
      res.status(401).json({ error: "An unknown error occurred" });
    }
  }
};
