// authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

interface JwtPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token as string | undefined;

    if (!token) {
      res.status(401).json({ message: "Not authorized, no token" });
      return;
    }

    // const decoded = jwt.verify(
    //   token,
    //   process.env.JWT_SECRET || "fallback_secret_key"
    // ) as JwtPayload;

    // removed the fallback secret key for better security
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret not configured");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "Not authorized, user not found" });
      return;
    }

    req.user = user; //
    next();
  } catch (_error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user;

  if (user && user.userType === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin only" });
  }
};
