import express from "express";
import passport from "passport";
import User from "../model/User.js";
import { getUserProfile, login, signUp } from "../controllers/user.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ========================
// Get current logged-in user
// ========================
router.get("/me", isLoggedIn,getUserProfile );

// ========================
// Register new user
// ========================
router.post("/signup",signUp );

// ========================
// Login existing user
// ========================
router.post(
  "/login",
  passport.authenticate("local"), // Passport handles user verification
  login
);

// ========================
// Logout current user
// ========================
router.get("/logout", (req, res, next) => {
  req.logout((err) => { // Passport removes req.user and clears session
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
