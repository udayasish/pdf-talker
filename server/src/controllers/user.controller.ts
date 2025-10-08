import User from "../models/User.model.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/nodemailer.js";

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(409).json({
          success: false,
          message: "User already exists and is verified",
        });
      }

      // User exists but not verified, generate new OTP
      const otp = generateOTP();
      existingUser.verificationToken = otp;
      await existingUser.save();

      await sendEmail(
        process.env.MAILTRAP_SENDEREMAIL!,
        existingUser.email,
        existingUser.name,
        otp
      );

      return res.status(200).json({
        success: true,
        message: "New OTP sent to your email",
      });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      password,
      verificationToken: otp,
    });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "User creation failed",
      });
    }

    await sendEmail(
      process.env.MAILTRAP_SENDEREMAIL!,
      user.email,
      user.name,
      otp
    );

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email for OTP verification.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "User registration failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  try {
    const user = await User.findOne({
      email,
      verificationToken: otp.toString(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or email",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Mark user as verified and clear the verification token
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Email verification failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Please fill all the fields" });

  try {
    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser)
      return res.status(400).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Password incorrect" });

    const isUserVerified = existingUser.isVerified;

    if (!isUserVerified)
      return res.status(400).json({ message: "User not verified" });

    const jwtSecret = process.env.JWT_ACCESS_TOKEN_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: "JWT secret not configured",
      });
    }

    const token = jwt.sign({ id: existingUser._id }, jwtSecret, {
      expiresIn: "24h",
    });

    console.log(`token is : ${token}`);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.log(`error is : ${error}`);

    res.status(400).json({ message: "User not logged in", error });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    console.log(`token is : ${token}`);

    if (!token) return res.status(400).json({ message: "Token not found" });

    const jwtSecret = process.env.JWT_ACCESS_TOKEN_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: "JWT secret not configured",
      });
    }

    const decodedToken = jwt.verify(token, jwtSecret) as { id: string };
    if (!decodedToken)
      return res.status(400).json({ message: "Invalid token" });

    const user = await User.findById(decodedToken.id);

    if (!user) return res.status(400).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User found",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(`error is : ${error}`);

    res.status(400).json({ message: "User not logged in", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(400).json({ message: "User not logged out", error });
  }
};
