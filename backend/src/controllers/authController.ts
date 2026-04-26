import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

interface RegisterBody {
  firstname: string;
  middlename?: string;
  lastname: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}
// helper function to generate JWT token and set it as a cookie
const generateTokenAndSetCookie = (res: Response, userId: unknown, userType: string) => {
  if (process.env.JWT_SECRET === undefined) {
    throw new Error("JWT secret not configured");
  }

  const token = jwt.sign({ id: userId, userType }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const register = async (
  req: Request<never, never, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    const { firstname, middlename, lastname, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstname,
      middlename,
      lastname,
      email,
      password: hashedPassword,
    });

    generateTokenAndSetCookie(res, user._id, user.userType);

    res.status(201).json({
      message: "User created successfully, and logged in successfully",
      userId: user._id,
    });
  } catch (_error) {
    console.error("Error during registration:", _error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const login = async (
  req: Request<never, never, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    generateTokenAndSetCookie(res, user._id, user.userType);

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (_error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (_error) {
    res.status(500).json({ message: "Server error getting user profile" });
  }
};
