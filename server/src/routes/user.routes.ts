import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/user.controller.js";

const router = express();

router.post("/register", register);
router.post("/verify", verifyEmail);
router.post("/login", login);
router.get("/current-user", getCurrentUser);
router.get("/logout", logout);

export default router;
