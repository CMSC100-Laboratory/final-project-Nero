import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "Not authorized, no token" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key") as any;
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "Not authorized, user not found" });
      return;
    }

    // attach user to the request object using type assertion for simplicity
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
